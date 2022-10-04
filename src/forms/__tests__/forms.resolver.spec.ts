import { Test, TestingModule } from '@nestjs/testing';
import { FormsResolver } from '../forms.resolver';
import { FormsService } from '../forms.service';
import { FormDocument } from '../schemas/form.schema';
import { LeanDocument } from 'mongoose';
import { FormAnswersDocument } from '../schemas/form-answers.schema';

describe('FormsResolver', () => {
  let resolver: FormsResolver;

  const formMock: LeanDocument<FormDocument> = {
    _id: 'abcedfghijkl',
    questions: [
      {
        id: 0,
        question: 'random question',
      },
    ],
  };

  const formAnswersMock: LeanDocument<FormAnswersDocument> = {
    _id: 'abcedfghijkl',
    answers: [{ questionId: 0, answer: 'random answer' }],
    userId: 1,
    form: undefined,
  };

  const formsServiceMock = {
    findOne: jest.fn((): LeanDocument<FormDocument> => formMock),
    create: jest.fn((): LeanDocument<FormDocument> => formMock),
    answerForm: jest.fn(
      (): LeanDocument<FormAnswersDocument> => formAnswersMock,
    ),
    findFormAnswers: jest.fn((): LeanDocument<FormAnswersDocument>[] => [
      formAnswersMock,
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormsResolver,
        { provide: FormsService, useValue: formsServiceMock },
      ],
    }).compile();

    resolver = module.get<FormsResolver>(FormsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('queries a single form', async () => {
    expect(await resolver.findOne('abcedfghijkl')).toMatchInlineSnapshot(`
      {
        "id": "abcedfghijkl",
        "questions": [
          {
            "id": 0,
            "question": "random question",
          },
        ],
      }
    `);
  });

  it('creates a form', async () => {
    expect(await resolver.createForm({ questions: ['random question'] }))
      .toMatchInlineSnapshot(`
      {
        "id": "abcedfghijkl",
        "questions": [
          {
            "id": 0,
            "question": "random question",
          },
        ],
      }
    `);
  });

  it('answers form', async () => {
    expect(
      await resolver.answerForm('abcedfghijkl', {
        answers: [{ questionId: 0, answer: 'random answer' }],
        userId: 1,
      }),
    ).toMatchInlineSnapshot(`
      {
        "answers": [
          {
            "answer": "random answer",
            "questionId": 0,
          },
        ],
        "id": "abcedfghijkl",
        "userId": 1,
      }
    `);
  });

  it('returns form answers', async () => {
    expect(
      await resolver.formAnswers({
        id: 'abcdefghijkl',
        questions: [],
        formAnswers: [],
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "answers": [
            {
              "answer": "random answer",
              "questionId": 0,
            },
          ],
          "id": "abcedfghijkl",
          "userId": 1,
        },
      ]
    `);
  });
});
