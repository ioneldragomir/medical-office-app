  // cnpValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     if (!control.value) {
  //       return null;
  //     }

  //     if (control.value.length != 13) {
  //       return null;
  //     }

  //     let isInvalid = false;
  //     const cnp = control.value;

  //     let validatorNumbers = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  //     let controlNumber = 0;

  //     for (let i = 0; i < 12; i++) {
  //       let cnpNumber = Number.parseInt(cnp[i]);

  //       controlNumber = controlNumber + cnpNumber * validatorNumbers[i];
  //     }

  //     controlNumber = controlNumber % 11;

  //     if (controlNumber === 10) {
  //       controlNumber = 1;
  //     }

  //     if (!(Number.parseInt(cnp[12]) === controlNumber)) {
  //       isInvalid = true;
  //     }

  //     return isInvalid ? { invalid: true } : null;
  //   };
  // }