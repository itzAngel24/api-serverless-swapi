import { CreateFusionData, IFusion, ValidationResult } from '@/utils/types/fusion.types';

export class Fusion implements IFusion {
  public readonly id: string;
  public readonly name: string;
  public readonly height: string;
  public readonly mass: string;
  public readonly gender: string;
  public readonly homeworld: string;
  public readonly favoritequote: string;
  public readonly createdAt: string;

  constructor(id: string, name: string, height: string, mass: string, gender: string, homeworld: string, favoritequote: string) {
    this.id = id;
    this.name = name?.trim();
    this.height = height?.trim();
    this.mass = mass?.trim();
    this.gender = gender?.trim();
    this.homeworld = homeworld?.trim();
    this.favoritequote = favoritequote?.trim();
    this.createdAt = new Date().toDateString();
  }

  public validate(): ValidationResult {
    const errors: string[] = [];
    
    if (!this.name || this.name.length === 0) {
      errors.push('Name is required');
    }
    
    if (!this.favoritequote || this.favoritequote.length === 0) {
      errors.push('Quote is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public toJSON(): IFusion {
    return {
      id: this.id,
      name: this.name,
      height: this.height,
      mass: this.mass,
      gender: this.gender,
      homeworld: this.homeworld,
      favoritequote: this.favoritequote,
      createdAt: this.createdAt
    };
  }

  public static fromData(id: string, data: CreateFusionData): Fusion {
    return new Fusion(id, data.name, data.height, data.mass, data.gender, data.homeworld, data.favoritequote);
  }
}