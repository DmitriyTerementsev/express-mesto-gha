const { celebrate, Joi } = require('celebrate');

const pattern =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;

module.exports.validateUrl = (url) => {
  if (pattern.test(url)) {
    return url;
  }
  throw new Error('Ссылка введена неверно');
};

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .messages({
        'string.empty': 'Это поле обязательное для заполнения',
      })
      .email()
      .message('Введите корректный email'),
    password: Joi.string().required().messages({
      'string.empty': 'Это поле обязательное для заполнения',
    }),
  }),
});

module.exports.validateUserName = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Текст должен быть не короче 2 символов',
      'string.max': 'Текст должен быть не короче 30 символов',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Текст должен быть не короче 2 символов',
      'string.max': 'Текст должен быть не короче 30 символов',
    }),
    avatar: Joi.string().pattern(pattern).message('Введите URL'),
    email: Joi.string()
      .required()
      .messages({
        'string.empty': 'Это поле обязательное для заполнения',
      })
      .email()
      .message('Введите корректный email'),
    password: Joi.string().required().messages({
      'string.empty': 'Это поле обязательное для заполнения',
    }),
  }),
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'Это поле обязательное для заполнения',
      'string.min': 'Текст должен быть не короче 2 символов',
      'string.max': 'Текст должен быть не короче 30 символов',
    }),
    about: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'Это поле обязательное для заполнения',
      'string.min': 'Текст должен быть не короче 2 символов',
      'string.max': 'Текст должен быть не короче 30 символов',
    }),
  }),
});

module.exports.validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .messages({
        'string.empty': 'Это поле обязательное для заполнения',
      })
      .pattern(pattern)
      .message('Введите URL'),
  }),
});

module.exports.validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'Минимальное количество символов - 2',
      'string.max': 'Максимальное количество символов - 30',
      'string.empty': 'Это поле обязательное для заполнения',
    }),
    link: Joi.string()
      .required()
      .pattern(pattern)
      .message('Введите URL')
      .messages({
        'string.empty': 'Это поле обязательное для заполнения',
      }),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required().messages({
      'string.length': 'Фиксированное количество символов id - 24',
      'string.empty': 'Это поле обязательное для заполнения',
    }),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required().messages({
      'string.length': 'Фиксированное количество символов id - 24',
      'string.empty': 'Это поле обязательное для заполнения',
    }),
  }),
});