import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFormInput } from './dto/create-form.input';
import { AnswerFormInput } from './dto/answer-form.input';
import { InjectModel } from '@nestjs/mongoose';
import { Form, FormDocument } from './schemas/form.schema';
import { Model, Types } from 'mongoose';
import {
  FormAnswers,
  FormAnswersDocument,
} from './schemas/form-answers.schema';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<FormDocument>,
    @InjectModel(FormAnswers.name)
    private formAnswersModel: Model<FormAnswersDocument>,
  ) {}

  /**
   * Create a new form
   */
  async create(createFormInput: CreateFormInput) {
    const form = await this.formModel.create({
      questions: createFormInput.questions.map((q, i) => ({
        id: i,
        question: q,
      })),
    });

    return form.toObject();
  }

  /**
   * Find a form by its ID
   */
  async findOne(id: Types.ObjectId) {
    return this.formModel.findById(id).lean();
  }

  /**
   * Save a new set of answers for given form ID
   */
  async answerForm(id: Types.ObjectId, answerFormInput: AnswerFormInput) {
    const form = await this.formModel.findById(id);

    if (!form) {
      throw new HttpException('Form not found', HttpStatus.NOT_FOUND);
    }

    const formAnswers = await this.formAnswersModel.create({
      ...answerFormInput,
      form,
    });

    return formAnswers.toObject();
  }

  /**
   * Find all sets of answers for given form ID
   */
  async findFormAnswers(id: Types.ObjectId) {
    return this.formAnswersModel
      .find({
        form: id,
      })
      .lean();
  }
}
