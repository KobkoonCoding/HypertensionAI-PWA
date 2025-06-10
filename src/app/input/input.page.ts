// src/app/input/input.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-input',
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  templateUrl: './input.page.html',
  styleUrls: ['./input.page.scss'],
})
export class InputPage implements OnInit {
  form: FormGroup;

  // --- START: PLACEHOLDER WEIGHTS AND BIASES (from previous steps) ---
  // IMPORTANT: You MUST replace these with the actual values from your .npy files,
  // converted to JavaScript arrays (e.g., via Python's numpy.tolist() and json.dumps()).
  // The dimensions below are illustrative:
  // W: [input_features x hidden_units] -> (8x10 example)
  // b: [hidden_units] -> (10 example)
  // B (beta): [hidden_units x output_classes] -> (10x2 example)

  // Example: 8 input features (gender, age, temp, pulse, rr, o2, weight, height)
  // Example: 10 hidden units
  // Example: 2 output classes (e.g., class 1, class 2)

  private W: number[][] = [
    // This is a dummy 8x10 matrix. REPLACE WITH YOUR REAL W MATRIX.
    [-0.7227139155937529, 0.9950960973686352, -1.4669417725875817, -1.9808606967826627, 0.17294093470489913, -0.863064150251437, 0.29864623030839743, -0.13670602430114903, -1.3834629258300424, -0.01209711356015241, 0.4235179550111574, 2.231477331823497, -0.6262996162811024, -1.381464441213863, 0.5855307999611665, 0.1414529480480043, -1.2406555636138872, -0.5899925631760783, 0.8793996359871102, 0.42924586730425274, 0.30413047831868434, 0.33701566599914484, 0.6457114666461838, 1.676389565473316, -0.16842889569049002, 0.18693767260698657, -2.380810756703685, -0.27380324235268005, -0.6087039059459992, 1.2765924186720818, 1.5627930564429087, -0.7153711658015658, -2.012102484321523, -0.7783062704675091, 2.194216459713142, 2.438050355753872, 2.0120314329201974, 2.2077864329449186, 0.4543456953253468, -0.3108221689808331], [-0.06725291623054322, 0.9486652194545449, -2.063344969884686, -0.41352045465449716, 1.0865895116559903, 0.48621560475760883, -1.7651502179212404, 1.188720254185126, -1.321704056397449, -1.2643431985394722, -0.3118970815595405, -0.4980586454917326, 0.7954331970211114, -0.5308707886155478, 0.5468584827343974, 1.0041727099248838, -0.515585831286467, -0.26681647742289977, -0.8539983512904581, -1.834439429980736, 1.1358032792933987, -1.2188911070533706, 0.7064447938556053, 0.47482182979781495, -0.3473334057374963, 0.9301483113035661, 0.8970861936016526, 0.46606486639019334, -1.1176654127427965, 1.1033428952396476, -0.030434990350325864, 0.5217621480345703, -0.911967475844887, 2.3133767439348767, -0.37452426438328107, -0.9639662594195033, -1.8679914355735112, -2.11348541900286, 0.6882015645691972, -0.8184408194968408], [-0.8005309751400342, 0.016660489581996417, -1.2778462941331974, -1.0690739011625014, 0.3507161629907899, -1.7114238081782032, -0.7139792545809743, 0.29275925926909674, 0.18338286993399308, -2.508425804498342, -0.40438291786307595, -0.3049942092819486, -1.0354988143917836, 1.0501234480710828, 0.8618209651799617, -0.169003253412241, -1.1311208755558184, 0.20268671701843644, -0.05205419106257156, -1.5599260636664871, 1.7665973995708084, 1.1458737713722178, -0.5179570692628558, -0.7367477745477699, 1.255326591392313, 0.4587605934508177, -0.6934092937164885, 0.18929655812340215, 0.9017100271448286, 0.1551317807416597, -1.851954916178072, 1.2652286383588551, -1.1763486684807944, 1.153825539823978, -0.927890365753256, 1.3005345730990443, -1.5244653378747697, 0.8425381278104366, 0.03495630332895878, 0.3449317005065859], [0.9602987627011051, -3.0792606511097125, 1.0226817540106532, -0.5077993205932815, 0.33257646285423664, -0.15990601961323211, 0.5392169338858115, 0.6644677224066048, 0.8491516741275312, 0.046684426097745715, 2.098824918757178, 0.6623357956486435, 0.41559608878266247, -0.7191826109916083, 1.555032716055244, -0.6204596373356592, -1.1360404312693442, -0.43108288342299106, -0.7726880058030178, -1.8253936167226776, 0.2787222749772576, 0.6945094813983156, -0.7807482882615336, -0.7525113526056534, -0.3164540309585556, 0.07761081463922985, -0.4015762066652229, 1.1562357092198765, -1.2817952291938017, 0.3576230421966364, -2.6514404067878625, 0.8645864110387711, 0.7220944905586294, -0.19949298317830597, 0.041575343742293894, -1.301319952843599, -0.16962038298322618, -0.8543719023455689, -0.05576869551612911, 0.25293858166097133], [-0.812642892671512, 0.046908761551717075, 0.22539824296714875, -0.895734238450484, -0.8371939795730229, 0.4182108880625611, 0.8942825253066047, -1.2390454825645, 1.2930425507030323, 0.8511647093249288, 0.7277232013698798, 0.5228339482987893, -0.2175318473197213, -0.17192197005132318, 0.2551149609430642, 1.0340472395879516, 0.4590483919595709, 0.169664538508113, -0.4087137129220615, -0.6826616274980389, 0.38801300185866505, -0.24321713623143476, -0.8998120956747596, 0.20295502834535503, -0.3070263390513714, 1.6060852444279183, 0.39162253667797975, 0.43648687165767874, 0.10018574929301689, -0.9592082589756036, -0.039357308362357304, -0.2596389716161615, -0.8166438179358961, -0.7560555023385914, 0.7337899776669239, -0.20978334494880305, 0.31409948912529856, -0.7697622635274826, 0.12069296064569507, 1.8882688801889755], [-1.184804785237974, -0.5661156277563317, 0.7851904196891539, -0.4540255826476401, -3.0274751591457716, 1.5862048890066784, -1.6227779956279373, 2.8056722106962244, -1.1917312951049368, 1.4866711107212338, 0.4243196993275285, 0.09350352533528725, -0.8714256380083606, -0.2689756376618887, -0.001691841438210559, 0.7302319481049779, 0.9663176531701527, -0.5950306226978833, -1.0481694016497516, -0.6386634298682238, -0.7464146717190466, -0.8189744725471584, -2.1167516795653887, 0.290890680899457, 0.5045015672320942, 0.008752459103174922, -1.1268769956571711, -0.9800838391919792, -0.6704511526519401, -0.635516780773884, 0.2555438761768798, -0.650672296020593, -0.4621396875156095, -0.10337805607529692, 0.01876409772778874, 0.6509370718199238, -1.662392949388769, 1.007584150873813, -2.78417914037066, -0.8117293286879789], [0.30950799420558744, 0.2736685466439123, -0.6832286809616107, -0.2717855801039898, -0.6022896718041493, 0.8890156015118279, 0.6689038073226476, -0.5963229947720479, -1.2317283284164964, -0.17805215505622293, -1.3266766831544727, -0.3966149760568561, -0.7586185930688696, 0.7316976970128798, -0.1502489561594809, -0.17420671729832954, -0.09644104279860177, -0.18448551707705801, -0.7034518206714219, 1.6716148047003847, 1.3756145995447204, -0.969573778555109, 0.3997422628728368, 0.02208258942974993, 1.839418428731623, -0.5658638006210706, -0.35084987751828733, -2.138257917323554, -0.3535339084330357, -1.4021199451107742, -2.253971496663079, 0.9533585527514384, -0.9007065408963028, -2.4376012025418667, -3.0840653524203034, 0.11106382290667174, -1.3000706262535466, -0.5957220429721168, 1.4043781582450199, -1.9966048296754475], [-0.9156692884997265, 0.42305754651006716, -0.04334302462014462, -1.0861458353040814, 0.030860204966980546, -1.1247761025361005, -0.9792655839095701, -0.7368832582719598, -1.2444045118643063, -0.8673051265252928, 0.7280702505632932, -0.8949896208735841, 1.0026666496806231, -0.7630937558911546, 2.957061785778611, -0.30007562178990654, 0.7768024750273973, -0.11188234307513155, -0.3693697375888284, -0.6231753082365964, -0.7794743871906255, -0.4591355752186032, -1.338445418227799, -1.4835787323246519, -0.4398989729330943, -1.3333453973013418, 0.5415152326915363, 0.6511398880182243, 1.1215573649026465, -1.6631094318447432, -0.6466847787665787, 0.7755518110245012, 0.3758734104375746, 0.6104818920008559, 0.8480314729613212, 0.08825200111924521, -2.1748433798397144, -0.8701602739672936, 1.9529859764904727, 1.7728149629969499]
  ];

  private b: number[] = [
    // This is a dummy 1x10 bias vector. REPLACE WITH YOUR REAL b VECTOR.
    -0.7404486143542479, 0.1872675838846385, -0.32534394722890103, -0.20505066445048142, -0.9027729445886902, 0.4847318027858523, -0.5211497856783784, -1.229687825321595, -0.7037956183126349, -1.6614055136273502, -1.889256390998376, -0.9166012219398358, 1.4192300055331644, 0.3344811562642187, 1.7872014652509194, 0.9114054142203195, 2.0881156328292545, -0.04355096029534649, -0.6378847058592506, -1.190823761875609, 0.9989922551376402, 1.5928604085864215, -0.4766534670458653, 1.2860762594507797, -0.0012525689354361124, 0.8172657271539365, -0.7641167745947751, 0.27475233591860515, -0.43798522274033685, -1.1321552450975936, 0.48319873683209896, 0.6813393619149111, -0.31348533505508575, -1.6036933771502977, -0.507309939923533, 0.8382973972033358, -1.1398825042354945, 0.6486183650064141, 0.5769637238218416, -0.41085310360641897
  ];

  private B: number[][] = [
    // This is a dummy 10x2 output weight (beta) matrix. REPLACE WITH YOUR REAL B MATRIX.
    [0.03808206991823333, -0.012306596734970402], [-0.31220920022189974, 0.3244553404983695], [0.6134331865724436, -0.5622126454383238], [0.0917501612042854, -0.0770312841977874], [-0.1344207460691944, 0.15094159560621168], [-0.23774547323633338, 0.3141356417299191], [0.0997522796794271, -0.07410065802175879], [-0.15532911807791014, 0.2120558849471251], [0.04568831314373893, -0.04884635474198022], [0.1328318209253691, -0.11056779988580535], [0.07452238921179323, -0.03915046669068906], [-0.23835111478511467, 0.26455324161333327], [0.21248774811792562, -0.11267044292477166], [0.1618335657409415, -0.12481539020008177], [0.11094402801541993, 0.004620479045333], [-0.22582688785736973, 0.30220286858054873], [0.5555187277872573, -0.46399133217880545], [0.17234160852197186, -0.14598227513102352], [0.18724558730725313, -0.17570588173084212], [0.1089919082145018, -0.09889189016830122], [-0.20024158626944397, 0.29567438475482805], [0.6344359617792078, -0.5686285489735914], [-0.11053465139878124, 0.12342951843043765], [-0.3737690684662099, 0.4416452845738048], [-0.13255304396311735, 0.2212115496325529], [-0.5359740870648477, 0.5840267479231119], [-0.02861331528208153, 0.047258564879741456], [0.16668500899906089, -0.1350563416304222], [0.5346727898101774, -0.5175395498966705], [-0.1563517880766808, 0.1596745385082677], [0.24948862739558564, -0.25158810594430353], [-0.08050234020330954, 0.18732255506310458], [0.29624449363225724, -0.266612076950857], [-0.14492927896004532, 0.13922735677885414], [0.39633522992386844, -0.3990074916799051], [0.1472067173375676, -0.08411100402299561], [0.029615567255581718, -0.027569367584277835], [0.7604637578090623, -0.7194733006668607], [-0.22959237114810563, 0.3144526231678198], [0.5391811035165354, -0.5355020574321878]
  ];
  // --- END: PLACEHOLDER WEIGHTS AND BIASES ---


  // --- START: NORMALIZATION PARAMETERS (YOU MUST HAVE REPLACED THESE) ---
  // These are the actual min_ and data_range_ values extracted from your Python MinMaxScaler.
  // The order of values must match your input features:
  // [gender, age, temp, pulse, rr, o2, weight, height]
  private minValues: number[] = [
    // PASTE YOUR ACTUAL data_min_ ARRAY HERE
    0.0,     // gender (min for 0/1)
    8.0,     // age (example min)
    35.69,    // temp (example min)
    45.0,    // pulse (example min)
    15.0,     // rr (example min)
    94.0,    // o2 (example min)
    26.0,     // weight (example min)
    137.0     // height (example min)
  ];

  private rangeValues: number[] = [
    // PASTE YOUR ACTUAL data_range_ ARRAY HERE
    1.0,     // gender (max 1 - min 0)
    89,   // age (example range for 0-120)
    1.51,    // temp (example range for 30-45)
    72,   // pulse (example range for 20-250)
    7.0,    // rr (example range for 5-60)
    6.0,    // o2 (example range for 50-100)
    72.0,   // weight (example range for 1-300)
    48.3    // height (example range for 50-250)
  ];
  // --- END: NORMALIZATION PARAMETERS ---


  constructor(private fb: FormBuilder, private router: Router, private popoverCtrl: PopoverController) {
    this.form = this.fb.group({
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      temp: ['', [Validators.required, Validators.min(30), Validators.max(45)]],
      pulse: ['', [Validators.required, Validators.min(20), Validators.max(250)]],
      rr: ['', [Validators.required, Validators.min(5), Validators.max(60)]],
      o2: ['', [Validators.required, Validators.min(50), Validators.max(100)]],
      weight: ['', [Validators.required, Validators.min(1), Validators.max(300)]],
      height: ['', [Validators.required, Validators.min(50), Validators.max(250)]],
    });
  }

  ngOnInit() {
    // Form now always starts fresh, previous values are not loaded.
  }

  // --- START: Neural Network Math & Scaling Helper Functions ---

  /**
   * Sigmoid activation function.
   * @param x The input value.
   * @returns The sigmoid activated value.
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Performs matrix multiplication between a 1xN vector and an NxM matrix,
   * returning a 1xM vector.
   * @param vector The 1D input vector (1xN).
   * @param matrix The 2D matrix (NxM).
   * @returns The resulting 1D vector (1xM).
   */
  private vectorMatrixMultiply(vector: number[], matrix: number[][]): number[] {
    const N = vector.length;       // N = number of columns in vector = number of rows in matrix
    const M = matrix[0].length;    // M = number of columns in matrix

    if (N !== matrix.length) {
      console.error("Dimension mismatch: Vector length must match matrix rows for multiplication.");
      return []; // Return empty array or throw error
    }

    let result: number[] = new Array(M).fill(0); // Resulting vector will have M elements

    for (let j = 0; j < M; j++) { // Iterate through columns of the matrix (output dimensions)
      let sum = 0;
      for (let i = 0; i < N; i++) { // Iterate through elements of the vector/rows of the matrix
        sum += vector[i] * matrix[i][j];
      }
      result[j] = sum;
    }
    return result;
  }

  /**
   * Adds two vectors element-wise.
   * @param vec1 The first vector.
   * @param vec2 The second vector.
   * @returns The sum vector.
   */
  private addVectors(vec1: number[], vec2: number[]): number[] {
    if (vec1.length !== vec2.length) {
      console.error("Dimension mismatch: Vectors must have the same length for addition.");
      return []; // Return empty array or throw error
    }
    return vec1.map((val, i) => val + vec2[i]);
  }

  /**
   * Scales a feature vector using Min-Max scaling.
   * X_scaled = (X - min) / (max - min)
   * @param inputVector The raw input feature vector.
   * @param minValues An array of min values for each feature from training data.
   * @param rangeValues An array of (max - min) values for each feature from training data.
   * @returns The scaled feature vector.
   */
  private scaleFeatures(inputVector: number[], minValues: number[], rangeValues: number[]): number[] {
    if (inputVector.length !== minValues.length || inputVector.length !== rangeValues.length) {
      console.error("Dimension mismatch: Input vector, minValues, and rangeValues must have the same length for scaling.");
      return [];
    }

    return inputVector.map((value, i) => {
      // Avoid division by zero if range is 0 (e.g., for binary features that are always 0 or 1)
      if (rangeValues[i] === 0) {
        return 0; // If range is 0, it means all training values were the same, so scaled value is 0.
      }
      return (value - minValues[i]) / rangeValues[i];
    });
  }
  // --- END: Neural Network Math & Scaling Helper Functions ---


  onSubmit() {
    this.form.markAllAsTouched(); // Show validation errors for all touched fields

    if (this.form.valid) {
      const formData = this.form.value;

      // 1. Create Raw Input Vector (X_raw) from user input
      // Make sure the order here EXACTLY matches the order your Python scaler and W matrix expect.
      const X_raw: number[] = [
        parseFloat(formData.gender),
        parseFloat(formData.age),
        parseFloat(formData.temp),
        parseFloat(formData.pulse),
        parseFloat(formData.rr),
        parseFloat(formData.o2),
        parseFloat(formData.weight),
        parseFloat(formData.height)
      ];

      console.log('Raw Input Vector (X_raw):', X_raw);

      // 2. Normalize the Input Vector (X) using the pre-calculated min/range values
      const X_scaled = this.scaleFeatures(X_raw, this.minValues, this.rangeValues);

      if (X_scaled.length === 0) {
        console.error("Scaling failed due to dimension mismatch. Aborting prediction.");
        return;
      }
      console.log('Scaled Input Vector (X_scaled):', X_scaled);


      // 3. Calculate Hidden Layer Output (H)
      // H = g(X_scaled * W + b)
      const XW_result = this.vectorMatrixMultiply(X_scaled, this.W); // X_scaled * W
      if (XW_result.length === 0) {
        console.error("Matrix multiplication for hidden layer failed. Aborting prediction.");
        return;
      }
      const Z = this.addVectors(XW_result, this.b); // X_scaled * W + b
      if (Z.length === 0) {
        console.error("Vector addition for hidden layer failed. Aborting prediction.");
        return;
      }
      const H = Z.map(val => this.sigmoid(val)); // g(X_scaled * W + b)

      console.log('Hidden Layer (H):', H);

      // 4. Calculate Predicted Outcome (Y)
      // Y = H * B (where B is beta, your output weight matrix)
      // Assuming B (beta) is a [hidden_units x output_classes] matrix.
      // The result Y will be a 1xoutput_classes vector.
      const Y = this.vectorMatrixMultiply(H, this.B);
      if (Y.length === 0) {
        console.error("Matrix multiplication for output layer failed. Aborting prediction.");
        return;
      }

      // Replicate np.clip(predict, 0, 1) from Python to ensure probabilities are within [0,1]
      const clippedY = Y.map(val => Math.max(0, Math.min(1, val)));

      console.log('Predicted Outcome (Y - clipped probabilities):', clippedY);

      // 5. Interpretation of Y: Find the class with the highest probability
      let predictedClassIndex = 0;
      let highestProbability = clippedY[0];

      for (let i = 1; i < clippedY.length; i++) {
        if (clippedY[i] > highestProbability) {
          highestProbability = clippedY[i];
          predictedClassIndex = i;
        }
      }

      // Assuming your classes are 0-indexed in Python (np.argmax returns 0 or 1)
      // and you want them to be 0-indexed in the output (matching your 'class_of_data': int(label[0]))
      const predictedClass = predictedClassIndex;
      const probabilityPercentage = (highestProbability * 100).toFixed(2);
      const roundedProbability = parseFloat(highestProbability.toFixed(2)); // Equivalent to np.round(prop, 2)

      console.log(`User is classified in Class ${predictedClass} with probability ${probabilityPercentage}%`);

      // Store the result to localStorage to be accessible on the /result page
      localStorage.setItem('predictionResult', JSON.stringify({
        predictedClass: predictedClass,
        probability: roundedProbability,
        rawOutput: clippedY,
        inputData: formData
      }));

      // Still save health data (optional, useful for debugging or if result page needs raw inputs)
      localStorage.setItem('healthData', JSON.stringify(formData));

      // Navigate to the result page
      this.router.navigateByUrl('/result');

    } else {
      console.log('Form is invalid. Please fill all required fields correctly.');
      // Optional: Add a toast or alert to inform the user (e.g., using ToastController)
    }
  }
}