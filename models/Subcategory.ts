// Subcategory.ts
export class Subcategory {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromMap(data: { [key: string]: any }): Subcategory {
    return new Subcategory(
      data['id'] as number,
      data['name'] as string
    );
  }
}
