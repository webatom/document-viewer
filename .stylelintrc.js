module.exports = {
  customSyntax: 'postcss-less',
  plugins: ['stylelint-order', 'stylelint-config-rational-order/plugin'],
  rules: {
    'selector-type-case': 'lower',
    'value-keyword-case': 'lower',
    'selector-attribute-quotes': 'always',
    'shorthand-property-no-redundant-values': true,
    'selector-pseudo-element-colon-notation': 'double',
    'color-hex-length': 'short',

    // properties order
    'order/order': [
      'custom-properties',
      'dollar-variables',
      'declarations',
      'at-rules',
      'rules',
    ],
    'order/properties-order': [],
    'plugin/rational-order': [
      true,
      {
        'border-in-box-model': false,
        'empty-line-between-groups': false,
      },
    ],
  },
};
