import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Tarefas } from './tarefas';
import { TarefaService } from './tarefa-service.service';
import { CustomvalidationService } from './customvalidation.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NgbModal, NgbModalConfig]
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('modalEditar', { static: false }) modalEditar: any;
  @ViewChild('modalApagar', { static: false }) modalApagar: any;

  private idmodal!: Number;

  tarefaFormGroup!: FormGroup;
  exiberro = false;
  exibesucesso = false;
  strerro = "";

  tarefas!: Tarefas[];

  isNumeric = (val: string): boolean => {
    return !isNaN(Number(val));
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  reformatarData(dateStr: string): string {
    let dArr = dateStr.split("-");
    return dArr[2] + "/" + dArr[1] + "/" + dArr[0];
  }

  reformatarDataUS(dateStr: string): string {
    let dArr = dateStr.split("/");
    return dArr[2] + "-" + dArr[1] + "-" + dArr[0];
  }

  escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  replaceAll(str: String, find: string, replace: string): string {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  formatNumber(): void {
    let custo = new String(this.tarefaFormGroup.controls["custo"].value);
    custo = this.replaceAll(custo, ',', '.');
    if ((custo.split('.').length - 1) > 1) {
      this.strerro = "Custo Inválido";
      this.exiberro = true;
    }
    else {
      this.exiberro = false;
    }
    (document.getElementById("custo") as HTMLInputElement).value = custo.toString();
  }

  onClickApagar() {
    console.log(this.idmodal);
    this.tarefaService.apagarTarefa(this.idmodal).subscribe(data => {
      let ok = <boolean>data;

      if (ok == true) {
        this.idmodal = -1;
        this.modalService.dismissAll();
        this.allTarefas();
      }
    });
  }

  onClickSubmit(s: string): void {

    this.exiberro = false;
    this.exibesucesso = false;
    if (!this.tarefaFormGroup.valid) {
      this.strerro = "Preencher todos os campos";
      this.exiberro = true;
      return;
    }

    let nometarefa = new String(this.tarefaFormGroup.controls["nometarefa"].value);
    let custo = Number(this.tarefaFormGroup.controls["custo"].value);
    let datalimite = new Date(this.tarefaFormGroup.controls["datalimite"].value);
    datalimite = this.addDays(datalimite, 1);
    datalimite.setHours(0, 0, 0, 0);

    if ((!isNaN(custo) == false) || (custo <= 0)) {
      this.strerro = "Custo somente números positivos!";
      this.exiberro = true;
    }
    else if (nometarefa.length >= 45) {
      this.strerro = "Nome Atividade inválido!";
      this.exiberro = true;
    }
    else {

      let dd = datalimite.getDate();
      let mm = datalimite.getMonth() + 1;
      let yyyy = datalimite.getFullYear();

      let d = "";
      let m = "";
      if (dd < 10) {
        d = '0' + dd;
      }
      else {
        d = dd.toString();
      }
      if (mm < 10) {
        m = '0' + mm;
      }
      else {
        m = mm.toString();
      }

      let dt = yyyy + '-' + m + '-' + d;

      let tarefa: Tarefas[] = [];
      tarefa.push({
        idtarefa: this.idmodal,
        nometarefa: nometarefa,
        custo: custo,
        datalimite: dt,
        ordemapresentacao: 0
      });

      if (s == 'n') {
        this.tarefaService.novaTarefa(tarefa).subscribe(data => {
          let ok = <boolean>data;

          if (ok == true) {
            this.exibesucesso = true;
            this.allTarefas();
          }
          else {
            this.exiberro = true;
            this.strerro = "Tarefa já existente!";
          }
        });
      }
      else if (s == 'e') {
        this.tarefaService.editarTarefa(tarefa).subscribe(data => {
          let ok = <boolean>data;

          if (ok == true) {
            this.idmodal = -1;
            this.modalService.dismissAll();
            this.allTarefas();
          }
          else {
            this.exiberro = true;
            this.strerro = "Tarefa já existente!";
          }
        });
      }
    }
  }

  exibemodal(content: any): void {
    this.tarefaFormGroup.setValue({ nometarefa: "", custo: "", datalimite: "" });
    this.modalService.open(content);
  }

  allTarefas(): void {
    this.tarefaService.selecionaTarefas().subscribe(data => {
      this.tarefas = [];

      let tb = $('#tb').DataTable();
      tb.clear().draw();
      setTimeout(() => {

        data.forEach(element => {
          let idtarefa = element["idtarefa"];
          let nometarefa = element["nometarefa"];
          let custo = element["custo"];
          let datalimite = element["datalimite"];
          let ordemapresentacao = element["ordemapresentacao"];

          let dt = this.reformatarData(datalimite.toString());

          let tmp = Number(custo);
          if (tmp >= 1000) {
            tb.row.add(
              $(
                "<tr style='color:rgba(255, 0, 0, 0.9);' cdkDrag><td>" +
                idtarefa +
                "</td><td>" +
                nometarefa +
                "</td><td>" +
                custo +
                "</td><td>" +
                dt +
                "</td><td><button id='bteditar' type='button' class='btn btn-outline-dark'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil-square' viewBox='0 0 16 16'>" +
                "<path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z'/>" +
                "<path fill-rule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'/>" +
                "</svg></button></td>" +
                "</td><td><button id='btapagar' type='button' class='btn btn-danger'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash-fill' viewBox='0 0 16 16'>" +
                "<path d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z'/>" +
                "</svg></button></td>" +
                "<td><button id='btsobe' type='button' class='btn btn-success'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-bar-up' viewBox='0 0 16 16'>" +
                "<path fill-rule='evenodd' d='M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z'/>" +
                "</svg></button></td>" +
                "<td><button id='btdesce' type='button' class='btn btn-warning'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-bar-down' viewBox='0 0 16 16'>" +
                "<path fill-rule='evenodd' d='M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z'/>" +
                "</svg></button></td></tr>"
              )
            );
          }
          else {
            tb.row.add(
              $(
                "<tr><td>" +
                idtarefa +
                "</td><td>" +
                nometarefa +
                "</td><td>" +
                custo +
                "</td><td>" +
                dt +
                "</td><td><button id='bteditar' type='button' class='btn btn-outline-dark'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil-square' viewBox='0 0 16 16'>" +
                "<path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z'/>" +
                "<path fill-rule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'/>" +
                "</svg></button></td>" +
                "</td><td><button id='btapagar' type='button' class='btn btn-danger'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash-fill' viewBox='0 0 16 16'>" +
                "<path d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z'/>" +
                "</svg></button></td>" +
                "<td><button id='btsobe' type='button' class='btn btn-success'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-bar-up' viewBox='0 0 16 16'>" +
                "<path fill-rule='evenodd' d='M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z'/>" +
                "</svg></button></td>" +
                "<td><button id='btdesce' type='button' class='btn btn-warning'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-bar-down' viewBox='0 0 16 16'>" +
                "<path fill-rule='evenodd' d='M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z'/>" +
                "</svg></button></td></tr>"
              )
            );
          }

          this.tarefas?.push({
            idtarefa: idtarefa,
            nometarefa: nometarefa,
            custo: custo,
            datalimite: dt,
            ordemapresentacao: ordemapresentacao
          })
        });

        tb.draw();
      }, 2);
    });

  }

  sobeOrdem(idtarefa: Number): void {
    this.tarefaService.sobedesceTarefa(idtarefa, "S").subscribe(data => {
      let ok = <boolean>data;

      if (ok == true) {
        this.allTarefas();
      }
    });
  }

  desceOrdem(idtarefa: Number): void {

    console.log("----- desce Ordem ----");
    console.log(idtarefa);

    this.tarefaService.sobedesceTarefa(idtarefa, "D").subscribe(data => {
      let ok = <boolean>data;

      if (ok == true) {
        this.allTarefas();
      }
    });
  }

  constructor(private formBuilder: FormBuilder, private tarefaService: TarefaService, modalConfig: NgbModalConfig, private modalService: NgbModal,
    private customValidator: CustomvalidationService, private elRef: ElementRef) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;

    this.tarefaFormGroup = this.formBuilder.group({
      nometarefa: ['', Validators.required],
      custo: [null, [Validators.required, this.customValidator.decimalValidator]],
      datalimite: ['', Validators.required]
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.allTarefas();
    }, 2);
  }

  ngOnInit(): void {

    let tb = $("#tb").DataTable({
      paging: false,
      lengthChange: true,
      searching: true,
      ordering: false,
      info: true,
      autoWidth: true,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, "Tudo"],
      ],
      rowCallback: (row: Node, data: Object, index: number) => {
        const self = this;

        let idtarefa: Number = 0;
        let nometarefa: string = "";
        let custo: Number = 0;
        let datalimite: string = "";
        Object.entries(data).forEach(entry => {
          const [key, value] = entry;
          switch (key) {
            case "0":
              idtarefa = Number(value);
              break;
            case "1":
              nometarefa = value;
              break;
            case "2":
              custo = Number(value);
              break;
            case "3":
              datalimite = value;
              break;
          }
        });

        $('#btapagar', row).unbind('click');
        $('#btapagar', row).bind('click', () => {
          this.exibemodal(this.modalApagar);
          this.idmodal = idtarefa;
        });

        $('#btsobe', row).unbind('click');
        $('#btsobe', row).bind('click', () => {
          this.sobeOrdem(idtarefa);
        });

        $('#btdesce', row).unbind('click');
        $('#btdesce', row).bind('click', () => {
          this.desceOrdem(idtarefa);
        });

        $('#bteditar', row).unbind('click');
        $('#bteditar', row).bind('click', () => {

          this.exibemodal(this.modalEditar);
          this.idmodal = idtarefa;
          this.tarefaFormGroup.setValue({ nometarefa: nometarefa, custo: custo, datalimite: this.reformatarDataUS(datalimite) });
        });

        return row;
      },
      search: { smart: false },
      language: {
        emptyTable: "Nenhum registro encontrado",
        info: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
        infoEmpty: "Mostrando 0 até 0 de 0 registros",
        infoFiltered: "(Filtrados de _MAX_ registros)",
        infoPostFix: "",
        lengthMenu: "_MENU_ resultados por página",
        loadingRecords: "Carregando...",
        processing: "Processando...",
        zeroRecords: "Nenhum registro encontrado",
        search: "Filtrar",
        paginate: {
          next: "Próximo",
          previous: "Anterior",
          first: "Primeiro",
          last: "Último",
        },
        aria: {
          sortAscending: ": Ordenar colunas de forma ascendente",
          sortDescending: ": Ordenar colunas de forma descendente",
        },
      },
    });
  }

  //convenience getter for easy access to form fields
  get form(): { [key: string]: AbstractControl; } {
    return this.tarefaFormGroup.controls;
  }
}
