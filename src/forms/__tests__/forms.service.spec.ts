import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from '../forms.service';
import { getModelToken } from '@nestjs/mongoose';
import { Form } from '../schemas/form.schema';
import { FormAnswers } from '../schemas/form-answers.schema';
import { Model, Types } from 'mongoose';
import { omit } from 'lodash';

describe('FormsService', () => {
  let service: FormsService;
  let formModel: Model<Form>;
  let formAnswersModel: Model<FormAnswers>;

  const form = {
    _id: new Types.ObjectId('abcdefghijkl'),
    questions: [
      {
        id: 0,
        question: 'For how long do you practice table tennis?',
      },
    ],
  };

  const formAnswers = {
    _id: new Types.ObjectId('abcdefghijkl'),
    userId: 1,
    answers: [
      {
        questionId: 0,
        answer: '10 years',
      },
    ],
    form,
  };

  const mockFormModel = () => ({
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  });

  const mockFormAnswersModel = () => ({
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormsService,
        {
          provide: getModelToken(Form.name),
          useFactory: mockFormModel,
        },
        {
          provide: getModelToken(FormAnswers.name),
          useFactory: mockFormAnswersModel,
        },
      ],
    }).compile();

    service = module.get<FormsService>(FormsService);
    formModel = module.get<Model<Form>>(getModelToken(Form.name));
    formAnswersModel = module.get<Model<FormAnswers>>(
      getModelToken(FormAnswers.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a form', async () => {
      const spy = jest.spyOn(formModel, 'create').mockReturnValueOnce({
        toObject: jest.fn().mockResolvedValueOnce(form),
      } as any);

      expect(
        await service.create({
          questions: ['For how long do you practice table tennis?'],
        }),
      ).toEqual({
        _id: expect.any(Types.ObjectId),
        questions: [
          {
            id: 0,
            question: 'For how long do you practice table tennis?',
          },
        ],
      });

      expect(spy).toHaveBeenCalledWith(omit(form, '_id'));
    });
  });

  describe('findOne', () => {
    it('returns found form', async () => {
      jest.spyOn(formModel, 'findById').mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(form),
      } as any);
      expect(await service.findOne(new Types.ObjectId())).toEqual({
        _id: expect.any(Types.ObjectId),
        questions: [
          {
            id: 0,
            question: 'For how long do you practice table tennis?',
          },
        ],
      });
    });

    it('returns null if form does not exist', async () => {
      jest.spyOn(formAnswersModel, 'create').mockReturnValueOnce({
        toObject: jest.fn().mockResolvedValueOnce(formAnswers),
      } as any);

      jest.spyOn(formModel, 'findById').mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      } as any);
      expect(await service.findOne(new Types.ObjectId())).toBeNull();
    });
  });

  describe('answerForm', () => {
    it('saves form answer', async () => {
      const spy = jest.spyOn(formAnswersModel, 'create').mockReturnValueOnce({
        toObject: jest.fn().mockResolvedValueOnce(formAnswers),
      } as any);

      jest.spyOn(formModel, 'findById').mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(form),
      } as any);

      expect(
        await service.answerForm(new Types.ObjectId(), {
          answers: [{ questionId: 0, answer: '10 years' }],
          userId: 1,
        }),
      ).toEqual({
        _id: expect.any(Types.ObjectId),
        userId: 1,
        answers: [
          {
            questionId: 0,
            answer: '10 years',
          },
        ],
        form: expect.objectContaining({
          _id: form._id,
        }),
      });

      expect(spy).toHaveBeenCalledWith({
        ...omit(formAnswers, '_id'),
        form: expect.anything(),
      });
    });

    it('cannot save answers if form is not found', async () => {
      await expect(
        service.answerForm(new Types.ObjectId(), {
          answers: [{ questionId: 0, answer: '10 years' }],
          userId: 1,
        }),
      ).rejects.toThrow('Form not found');
    });
  });

  describe('findFormAnswers', () => {
    it('returns form answers', async () => {
      jest.spyOn(formAnswersModel, 'find').mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce([
          {
            ...formAnswers,
            form: form._id,
          },
        ]),
      } as any);

      expect(await service.findFormAnswers(new Types.ObjectId())).toEqual([
        {
          _id: formAnswers._id,
          answers: [{ questionId: 0, answer: '10 years' }],
          userId: 1,
          form: form._id,
        },
      ]);
    });

    it('cannot find answers of unknown form', async () => {
      jest.spyOn(formAnswersModel, 'find').mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce([]),
      } as any);

      expect(await service.findFormAnswers(new Types.ObjectId())).toEqual([]);
    });
  });
});
