import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute  } from '@angular/router'; 
import {searchApi} from '../../../../utils/searchService';
import { CamundaService } from '../../../../utils/camunda.service';

@Component({
  selector: 'app-pre-arrangement-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pre-arrangement-form.html',
  styleUrl: './pre-arrangement-form.css',
})
export class PreArrangementForm implements OnInit{

  form: FormGroup;
  departmentValue: 'IPD' | 'OPD' = 'IPD';
  taskname = '';
  processInstanceId = '2251799814227796';
  userTaskKey = '';
  processInstanceKey = '';

  @Input() set department(value: 'IPD' | 'OPD') {
    if (value) this.onDepartmentChange(value);
  }
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private camundaService: CamundaService
  ) {
    this.form = this.fb.group({
      nationalId: [''],
      policyNumber: [''],
      visitType: ['', Validators.required],
      reservationType: ['', Validators.required],
      hospitalName: ['', Validators.required],
      icd10: ['', Validators.required],
      icd9: [''],
      admissionDate: ['', Validators.required],
      accidentDate: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const dept = params['dept'];
      if (dept === 'IPD' || dept === 'OPD') {
        this.department = dept;
      }
    });
    this.camundaService.processIntanceKey$.subscribe(key => {
      if (key) {
        this.processInstanceKey = key;
      }
    });
  }


  onDepartmentChange(dept: 'IPD' | 'OPD') {
    this.departmentValue = dept;
    if (dept === 'IPD') {
      this.form.get('admissionDate')?.setValidators([Validators.required]);
      this.form.get('dischargeDate')?.setValidators([Validators.required]);
      this.form.get('visitDate')?.clearValidators();
      this.form.get('visitDate')?.setValue('');
    } else {
      this.form.get('visitDate')?.setValidators([Validators.required]);
      this.form.get('admissionDate')?.clearValidators();
      this.form.get('admissionDate')?.setValue('');
      this.form.get('dischargeDate')?.clearValidators();
      this.form.get('dischargeDate')?.setValue('');
    }

    this.form.get('admissionDate')?.updateValueAndValidity();
    this.form.get('dischargeDate')?.updateValueAndValidity();
    this.form.get('visitDate')?.updateValueAndValidity();
  }

  submitForm() {
    this.form.markAllAsTouched();
    this.taskname = 'Search Customer Info';

    if (this.form.valid) {
      console.log('Form Values:', this.form.value);

      const fv = this.form.value;
      const processDefinitionId = (searchApi as any)?.processDefinitionId || 'variable need to inserted';


      const payload = {
        state: 'ASSIGNED',
        assignee: 'demo',
        processDefinitionId,
        processInstanceVariables: [
          {
        customerInfo: {
          nationalId: fv.nationalId || '',
          policyNumber: fv.policyNumber || '',
        },
        visitInfo: {
          visitType: fv.visitType || '',
          reservationType: fv.reservationType || '',
          HospitalName: fv.hospitalName || '',
          ICD10: fv.icd10 || '',
          ICD9: fv.icd9 || '',
          AdmissionDate: fv.admissionDate || '',
          AccidentDate: fv.accidentDate || '',
        },
          },
        ],
        localVariables: [],
        userTaskKey: 'string',
        processDefinitionKey: '2251799813686749',
        processInstanceKey: this.processInstanceKey,
        elementInstanceKey: '2251799813686789',
      };

      const body = {
        payload,
        page: {
          from: 0,
          limit: 100,
        },
      };

      console.log("proccess instance key",this);

      this.camundaService.getUserTaskByProcessInstance(this.processInstanceKey, this.taskname)
        .subscribe({
          next: (res) => {
            this.userTaskKey = res.userTaskKey;
            const variables = {
              customerInfo: {
                nationalId: fv.nationalId || '',
                policyNumber: fv.policyNumber || '',
              },
              visitInfo: {
                visitType: fv.visitType || '',
                reservationType: fv.reservationType || '',
                HospitalName: fv.hospitalName || '',
                ICD10: fv.icd10 || '',
                ICD9: fv.icd9 || '',
                AdmissionDate: fv.admissionDate || '',
                AccidentDate: fv.accidentDate || '',
              }
            };
            console.log("user task Key ", this.userTaskKey);
            // Complete user task
            this.camundaService.completeUserTask(this.userTaskKey, variables).subscribe({
              next: () => {
                console.log('✅ Task completed successfully');
              },
              error: (err) => {
                console.error('❌ Error completing task:', err);
              },
            });
          },
          error: (err) => {
            console.error('Error fetching user task:', err);
          //  this.message = 'Failed to fetch user task';
          }
        });

       
 

     
      /*  searchApi(body).then((response) => {
            console.log('API Response:', response);
            this.formSubmitted.emit(response);  
        }).catch((error) => {
            console.error('API Error:', error);
        });
        */
        

      } else {
      console.warn('⚠️ Form is invalid. Please check the required fields.');
        }
        
      }
}
