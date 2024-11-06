const Validations = {
  REQUIRED: {
    required: {
      message: 'This field is required.',
    },
    validate: (v) => (v && v?.trim() !== '') || 'This field is required.',
  },
};

export default Validations;
