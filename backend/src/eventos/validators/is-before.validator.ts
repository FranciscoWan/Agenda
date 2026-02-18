import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(value: Date, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!relatedValue) return true;

    return new Date(value) > new Date(relatedValue);
  }

  defaultMessage(args: ValidationArguments) {
    return `dataFim deve ser maior que dataInicio`;
  }
}
