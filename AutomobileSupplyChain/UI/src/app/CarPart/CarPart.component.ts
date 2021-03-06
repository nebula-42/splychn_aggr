/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CarPartService } from './CarPart.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-carpart',
  templateUrl: './CarPart.component.html',
  styleUrls: ['./CarPart.component.css'],
  providers: [CarPartService]
})
export class CarPartComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  amount = new FormControl('', Validators.required);
  partType = new FormControl('', Validators.required);
  carPartStatus = new FormControl('', Validators.required);
  id = new FormControl('', Validators.required);
  GHG = new FormControl('', Validators.required);
  atStage = new FormControl('', Validators.required);

  constructor(public serviceCarPart: CarPartService, fb: FormBuilder) {
    this.myForm = fb.group({
      amount: this.amount,
      partType: this.partType,
      carPartStatus: this.carPartStatus,
      id: this.id,
      GHG: this.GHG,
      atStage: this.atStage
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCarPart.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.automobilesupplychain.basic.CarPart',
      'amount': this.amount.value,
      'partType': this.partType.value,
      'carPartStatus': this.carPartStatus.value,
      'id': this.id.value,
      'GHG': this.GHG.value,
      'atStage': this.atStage.value
    };

    this.myForm.setValue({
      'amount': null,
      'partType': null,
      'carPartStatus': null,
      'id': null,
      'GHG': null,
      'atStage': null
    });

    return this.serviceCarPart.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'amount': null,
        'partType': null,
        'carPartStatus': null,
        'id': null,
        'GHG': null,
        'atStage': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.automobilesupplychain.basic.CarPart',
      'amount': this.amount.value,
      'partType': this.partType.value,
      'carPartStatus': this.carPartStatus.value,
      'GHG': this.GHG.value,
      'atStage': this.atStage.value
    };

    return this.serviceCarPart.updateAsset(form.get('id').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceCarPart.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceCarPart.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'amount': null,
        'partType': null,
        'carPartStatus': null,
        'id': null,
        'GHG': null,
        'atStage': null
      };

      if (result.amount) {
        formObject.amount = result.amount;
      } else {
        formObject.amount = null;
      }

      if (result.partType) {
        formObject.partType = result.partType;
      } else {
        formObject.partType = null;
      }

      if (result.carPartStatus) {
        formObject.carPartStatus = result.carPartStatus;
      } else {
        formObject.carPartStatus = null;
      }

      if (result.id) {
        formObject.id = result.id;
      } else {
        formObject.id = null;
      }

      if (result.GHG) {
        formObject.GHG = result.GHG;
      } else {
        formObject.GHG = null;
      }

      if (result.atStage) {
        formObject.atStage = result.atStage;
      } else {
        formObject.atStage = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'amount': null,
      'partType': null,
      'carPartStatus': null,
      'id': null,
      'GHG': null,
      'atStage': null
      });
  }

}
