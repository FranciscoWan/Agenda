import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {

  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!value || !relatedValue) return true;

    const currentDate = new Date(value);
    const relatedDate = new Date(relatedValue);

    if (isNaN(currentDate.getTime()) || isNaN(relatedDate.getTime())) {
      return true; // deixa o IsDate tratar
    }

    return currentDate > relatedDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Data final deve ser maior que a data de início da atividade';
  }
}