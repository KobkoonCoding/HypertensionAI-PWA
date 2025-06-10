import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

/* ────────────────────────────────
   Recommendation Interface
──────────────────────────────────*/
interface Recommendation {
  title: string;
  description: string;
  icon: string;
  applicableTo: ('low' | 'medium' | 'high')[];
}

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ResultPage implements OnInit {

  predictionResult: any;
  resultTimestamp: Date = new Date();

  showDetails = false;
  riskScore: number | null = null;
  currentRiskLevel: 'low' | 'medium' | 'high' | null = null;
  riskLevelText = '';
  filteredRecommendations: Recommendation[] = [];

  /* ───────────── COMPLETE RECOMMENDATION SET ───────────── */
  private allRecommendations: Recommendation[] = [
    /* Low Risk */
    { title:'ป้องกันไม่ให้ความเสี่ยงสูงขึ้น',
      description:'เน้นการส่งเสริมสุขภาพและเฝ้าระวัง เพื่อป้องกันไม่ให้เข้าสู่กลุ่มเสี่ยงสูง.',
      icon:'leaf-outline', applicableTo:['low'] },
    { title:'ปรับพฤติกรรมเพื่อสุขภาพ',
      description:'ปรับพฤติกรรมเช่นเดียวกับกลุ่มเสี่ยงปานกลาง เพื่อรักษาสุขภาพที่ดีและลดความเสี่ยง.',
      icon:'restaurant-outline', applicableTo:['low'] },
    { title:'ตรวจวัดความดันปีละครั้ง',
      description:'ตรวจวัดความดันโลหิตอย่างน้อยปีละ 1 ครั้ง เพื่อเฝ้าระวังและติดตามสุขภาพของคุณอย่างสม่ำเสมอ.',
      icon:'heart-circle-outline', applicableTo:['low'] },
    { title:'ติดตามใกล้ชิดหากความดันเริ่มสูง',
      description:'หากค่าความดันอยู่ในช่วง 130-139/80-89 มม.ปรอท (BP at risk) ควรเริ่มติดตามใกล้ชิดยิ่งขึ้น.',
      icon:'trending-up-outline', applicableTo:['low'] },

    /* Medium Risk */
    { title:'ควบคุมความดันด้วยพฤติกรรม',
      description:'เริ่มต้นด้วยการปรับพฤติกรรมอย่างเคร่งครัด เช่น ลดเค็ม (โซเดียม < 2 กรัม/วัน), ลดน้ำหนัก (หาก BMI > 23), ออกกำลังกายสม่ำเสมอ (150 นาที/สัปดาห์), งดสูบบุหรี่ และจำกัดแอลกอฮอล์.',
      icon:'walk-outline', applicableTo:['medium'] },
    { title:'พิจารณาให้ยาหากไม่ดีขึ้น',
      description:'หากไม่สามารถควบคุมความดันได้ภายใน 3 เดือนด้วยการปรับพฤติกรรม ควรปรึกษาแพทย์เพื่อพิจารณาการใช้ยา.',
      icon:'pill-outline', applicableTo:['medium'] },
    { title:'ตรวจสุขภาพประจำปี',
      description:'ตรวจสุขภาพประจำปีเพื่อติดตามอวัยวะเป้าหมาย เช่น หัวใจ ไต ตา.',
      icon:'pulse-outline', applicableTo:['medium'] },

    /* High Risk */
    { title:'ปรึกษาแพทย์และเริ่มยาทันที',
      description:'ควรปรึกษาแพทย์และเริ่มต้นการรักษาด้วยยาทันที ร่วมกับการปรับเปลี่ยนพฤติกรรมการใช้ชีวิตอย่างเคร่งครัด เพื่อควบคุมความดันโลหิตให้ต่ำกว่า 130/80 มม.ปรอท โดยเร็วที่สุด.',
      icon:'medical-outline', applicableTo:['high'] },
    { title:'ดูแลโรคร่วมอย่างใกล้ชิด',
      description:'ประเมินและรักษาปัจจัยร่วมอื่นๆ เช่น เบาหวาน, ไขมันในเลือดสูง, โรคหัวใจ, หรือโรคไต เพื่อการดูแลสุขภาพที่ครอบคลุม.',
      icon:'clipboard-outline', applicableTo:['high'] },
    { title:'ติดตามอาการและปรับยา',
      description:'ติดตามอาการอย่างใกล้ชิด และปรับยาให้ได้ตามเป้าหมายภายใน 3 เดือน.',
      icon:'time-outline', applicableTo:['high'] },
    { title:'ปรึกษาแพทย์เฉพาะทาง',
      description:'หากความดันโลหิตไม่ลดลงตามเป้าหมาย (resistant hypertension) ควรส่งต่อแพทย์เฉพาะทางเพื่อการรักษาที่เหมาะสม.',
      icon:'people-outline', applicableTo:['high'] },
  ];

  /* ------------------------------------------------------ */

  ngOnInit(): void {
    this.loadPredictionResultAndRecommendations();
  }

  /* ───────────── HELPER METHODS ───────────── */
  private loadPredictionResultAndRecommendations(): void {
    const savedResult = localStorage.getItem('predictionResult');
    if (!savedResult) {
      this.currentRiskLevel = null;
      this.riskLevelText = 'ไม่พบข้อมูลการทำนาย';
      return;
    }

    this.predictionResult = JSON.parse(savedResult);
    this.calculateRiskScoreAndLevel();
    this.filterRecommendations();
  }

  private calculateRiskScoreAndLevel(): void {
    const probClass1 = this.predictionResult.rawOutput?.[1] ?? null;

    if (this.predictionResult.predictedClass === 0) {
      this.riskScore = probClass1 ? Math.round(probClass1 * 100) : null;
      if (this.riskScore !== null && this.riskScore >= 40) this.riskScore = 39;
      this.currentRiskLevel = 'low';
    } else if (this.predictionResult.predictedClass === 1) {
      this.riskScore = probClass1 ? Math.round(probClass1 * 100) : null;
      if (this.riskScore !== null) {
        if (this.riskScore >= 60)       this.currentRiskLevel = 'high';
        else if (this.riskScore >= 40) this.currentRiskLevel = 'medium';
        else                           this.currentRiskLevel = 'medium';
      }
    }

    switch (this.currentRiskLevel) {
      case 'low':    this.riskLevelText = `ความเสี่ยงต่ำ (คะแนน ${this.riskScore})`;    break;
      case 'medium': this.riskLevelText = `ความเสี่ยงปานกลาง (คะแนน ${this.riskScore})`; break;
      case 'high':   this.riskLevelText = `ความเสี่ยงสูง (คะแนน ${this.riskScore})`;     break;
      default:       this.riskLevelText = 'ไม่สามารถประเมินความเสี่ยงได้';
    }
  }

  private filterRecommendations(): void {
    this.filteredRecommendations =
      this.allRecommendations.filter(rec =>
        rec.applicableTo.includes(this.currentRiskLevel as any));
  }

  /* UI */
  viewDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
