// models/FarmModel.ts

import { DocumentSnapshot } from 'firebase/firestore';

export class Farm {
  farmId: string;
  name: string;
  lga: string;
  state: string;
  imageUrl: string;

  constructor({
    farmId,
    name,
    lga,
    state,
    imageUrl,
  }: {
    farmId: string;
    name: string;
    lga: string;
    state: string;
    imageUrl: string;
  }) {
    this.farmId = farmId;
    this.name = name;
    this.lga = lga;
    this.state = state;
    this.imageUrl = imageUrl;
  }

  static fromFirestore(doc: DocumentSnapshot): Farm {
    const data = doc.data() as Record<string, any>;
    return new Farm({
      farmId: doc.id,
      name: data['farmName'],
      lga: data['lga'],
      state: data['country'],
      imageUrl: data['imagePath'],
    });
  }
}
