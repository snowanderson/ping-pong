import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Form } from './form.schema';
import { Int } from '@nestjs/graphql';

export type FormAnswersDocument = FormAnswers & Document;

export class Answer extends Document {
  @Prop({ type: Int })
  questionId: number;

  @Prop()
  answer: string;
}

@Schema({ versionKey: false })
export class FormAnswers {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Form' })
  form: Form;

  @Prop([Answer])
  answers: Answer[];

  @Prop()
  userId: number;
}

export const FormAnswersSchema = SchemaFactory.createForClass(FormAnswers);
