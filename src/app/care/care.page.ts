// src/app/care/care.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

// Interface for recommendation structure
interface Recommendation {
  title: string;
  description: string;
  icon: string;
  applicableTo: ('low' | 'high')[]; // 'low' for low/medium risk, 'high' for high risk
}

@Component({
  selector: 'app-care',
  templateUrl: './care.page.html',
  styleUrls: ['./care.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class CarePage implements OnInit {
  currentRiskLevel: 'low' | 'high' | null = null;
  riskLevelText: string = '';
  filteredRecommendations: Recommendation[] = [];

  // Define all possible recommendations based on the PDF content
  private allRecommendations: Recommendation[] = [
    // Recommendations for Low/Medium Risk (predictedClass === 0)
    {
      title: 'ปรับพฤติกรรมเพื่อป้องกัน',
      description: 'เน้นการปรับพฤติกรรมการใช้ชีวิต เช่น ลดเค็ม, ลดน้ำหนัก, ออกกำลังกาย, งดสูบบุหรี่ และจำกัดแอลกอฮอล์ เพื่อป้องกันความเสี่ยงที่เพิ่มขึ้น.',
      icon: 'leaf-outline',
      applicableTo: ['low']
    },
    {
      title: 'ตรวจวัดความดันปีละครั้ง',
      description: 'ตรวจวัดความดันโลหิตอย่างน้อยปีละ 1 ครั้ง เพื่อเฝ้าระวังและติดตามสุขภาพของคุณอย่างสม่ำเสมอ.',
      icon: 'heart-circle-outline',
      applicableTo: ['low']
    },
    {
      title: 'ติดตามใกล้ชิดหากความดันเริ่มสูง',
      description: 'หากค่าความดันอยู่ในช่วง 130-139/80-89 มม.ปรอท ควรเริ่มติดตามและปรึกษาแพทย์ใกล้ชิดยิ่งขึ้น.',
      icon: 'trending-up-outline',
      applicableTo: ['low']
    },
    {
      title: 'พิจารณาให้ยา (กลุ่มเสี่ยงปานกลาง)', // Combined with low for this app's output
      description: 'หากปรับพฤติกรรมแล้วความดันยังไม่ดีขึ้นภายใน 3 เดือน ควรปรึกษาแพทย์เพื่อพิจารณาการใช้ยา.',
      icon: 'pill-outline',
      applicableTo: ['low'] // Applicable to medium, so included in 'low' mapping
    },
    {
      title: 'ตรวจสุขภาพประจำปี',
      description: 'ตรวจสุขภาพประจำปีเพื่อติดตามอวัยวะเป้าหมาย เช่น หัวใจ ไต ตา.',
      icon: 'pulse-outline',
      applicableTo: ['low'] // Applicable to medium, so included in 'low' mapping
    },
    // Recommendations for High Risk (predictedClass === 1)
    {
      title: 'ปรึกษาแพทย์และเริ่มยาทันที',
      description: 'ควรปรึกษาแพทย์และเริ่มต้นการรักษาด้วยยาทันที ร่วมกับการปรับเปลี่ยนพฤติกรรมการใช้ชีวิตอย่างเคร่งครัด.',
      icon: 'medical-outline',
      applicableTo: ['high']
    },
    {
      title: 'ดูแลโรคร่วม',
      description: 'ประเมินและรักษาปัจจัยร่วมอื่นๆ เช่น เบาหวาน, ไขมันในเลือดสูง, โรคหัวใจ, หรือโรคไต เพื่อการดูแลสุขภาพที่ครอบคลุม.',
      icon: 'clipboard-outline',
      applicableTo: ['high']
    },
    {
      title: 'ติดตามใกล้ชิดทุก 1-3 เดือน',
      description: 'ติดตามอาการและปรับยาให้ได้ตามเป้าหมายความดันโลหิต (<130/80 มม.ปรอท) ภายใน 3 เดือน.',
      icon: 'time-outline',
      applicableTo: ['high']
    },
    {
      title: 'ส่งต่อแพทย์เฉพาะทาง',
      description: 'หากความดันโลหิตไม่ลดลงตามเป้าหมาย (resistant hypertension) ควรส่งต่อแพทย์เฉพาะทางเพื่อการรักษาที่เหมาะสม.',
      icon: 'people-outline',
      applicableTo: ['high']
    },
    // General recommendations applicable to all (but we'll filter them by assigned risk level)
    {
      title: 'ลดโซเดียมและอาหารแปรรูป',
      description: 'ลดการบริโภคเกลือและอาหารแปรรูป ช่วยลดภาระให้หัวใจและหลอดเลือดของคุณ.',
      icon: 'restaurant-outline',
      applicableTo: ['low', 'high']
    },
    {
      title: 'ออกกำลังกายสม่ำเสมอ',
      description: 'การเคลื่อนไหวร่างกายอย่างสม่ำเสมอช่วยเสริมสร้างสุขภาพหัวใจและควบคุมน้ำหนัก.',
      icon: 'walk-outline',
      applicableTo: ['low', 'high']
    },
    {
      title: 'จัดการความเครียด',
      description: 'หาเวลาผ่อนคลายและจัดการความเครียด เพื่อสุขภาพจิตที่ดีและลดผลกระทบต่อความดันโลหิต.',
      icon: 'leaf-outline',
      applicableTo: ['low', 'high']
    },
    {
      title: 'พักผ่อนให้เพียงพอ',
      description: 'การนอนหลับที่มีคุณภาพช่วยให้ร่างกายฟื้นตัวและรักษาสมดุลความดันโลหิต.',
      icon: 'moon-outline',
      applicableTo: ['low', 'high']
    },
  ];

  constructor() { }

  ngOnInit() {
    this.loadPredictionResultAndRecommendations();
  }

  loadPredictionResultAndRecommendations() {
    const savedResult = localStorage.getItem('predictionResult');
    if (savedResult) {
      const predictionResult = JSON.parse(savedResult);
      const predictedClass = predictionResult.predictedClass; // 0 or 1

      if (predictedClass === 0) {
        this.currentRiskLevel = 'low';
        this.riskLevelText = 'ความเสี่ยงต่ำ/ปานกลาง';
      } else if (predictedClass === 1) {
        this.currentRiskLevel = 'high';
        this.riskLevelText = 'ความเสี่ยงสูง';
      } else {
        // Fallback or error case if predictedClass is unexpected
        this.currentRiskLevel = null;
        this.riskLevelText = 'ไม่สามารถประเมินความเสี่ยงได้';
      }

      // Filter recommendations based on the determined risk level
      this.filteredRecommendations = this.allRecommendations.filter(rec =>
        rec.applicableTo.includes(this.currentRiskLevel!) // Use ! to assert non-null
      );
      console.log('Filtered Recommendations:', this.filteredRecommendations);

    } else {
      console.log('No prediction result found in localStorage. Cannot provide recommendations.');
      // Optionally redirect user back to input page or display a message
      this.currentRiskLevel = null;
      this.riskLevelText = 'ไม่พบข้อมูลการทำนาย';
    }
  }
}