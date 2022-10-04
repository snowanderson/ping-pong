import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Int } from '@nestjs/graphql';

export type FormDocument = Form & Document;

export class Question extends Document {
  @Prop({ type: Int })
  id: number;

  @Prop()
  question: string;
}

@Schema({ versionKey: false })
export class Form {
  @Prop([Question])
  questions: Question[];
}

export const FormSchema = SchemaFactory.createForClass(Form);
