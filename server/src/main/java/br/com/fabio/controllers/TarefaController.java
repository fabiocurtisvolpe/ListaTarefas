package br.com.fabio.controllers;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.fabio.model.Tarefa;
import br.com.fabio.repository.TarefaRepository;

// http://localhost:8080/tarefas

@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    private List<Tarefa> tarefas = new ArrayList<>();

    @Autowired
    private TarefaRepository tarefaRepository;

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<List<Tarefa>> seleciona_tarefas() {
        System.out.println("-------- seleciona_tarefas -------- ");

        tarefas.clear();
        Iterable<Tarefa> tIterable = tarefaRepository.getAllTarefas();
        tIterable.forEach(tarefas::add);

        return new ResponseEntity<>(tarefas, HttpStatus.OK);
    }

    @RequestMapping(value = "/id={id}", method = RequestMethod.GET)
    public ResponseEntity<List<Tarefa>> seleciona_tarefa(@PathVariable("id") String id) {
        System.out.println("-------- seleciona_tarefa -------- ");
        System.out.println(id);

        tarefas.clear();
        Iterable<Tarefa> tIterable = tarefaRepository.getTarefa(Integer.parseInt(id));
        tIterable.forEach(tarefas::add);

        return new ResponseEntity<>(tarefas, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/nova", method = RequestMethod.POST)
    public ResponseEntity<Boolean> novaTarefa(@RequestBody Map<String, Object> json) throws Exception {

        Boolean ok = false;
        System.out.println(json);

        String nometarefa = "";
        BigDecimal custo = null;
        String datalimite = "";
        for (Map.Entry<String, Object> entry : json.entrySet()) {
            switch (entry.getKey()) {
                case "nometarefa":
                    nometarefa = entry.getValue().toString();
                    break;
                case "custo":
                    // custo = BigDecimal.valueOf(Long.parseLong(entry.getValue().toString()));
                    custo = BigDecimal.valueOf(Double.parseDouble(entry.getValue().toString().replace(',', '.')));
                    break;
                case "datalimite":
                    datalimite = entry.getValue().toString();
                    break;
            }
            System.out.println(entry.getKey() + " : " + entry.getValue().toString());
        }

        System.out.println("-------- novaTarefa -------- ");
        System.out.println(nometarefa);
        System.out.println(custo);
        System.out.println(datalimite);

        ok = tarefaRepository.nTarefa(nometarefa, custo, datalimite);
        System.out.println(ok);

        return new ResponseEntity<>(ok, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/editar", method = RequestMethod.POST)
    public ResponseEntity<Boolean> editarTarefa(@RequestBody Map<String, Object> json) throws Exception {

        Boolean ok = false;
        System.out.println(json);

        Integer idtarefa = 0;
        String nometarefa = "";
        BigDecimal custo = null;
        String datalimite = "";
        for (Map.Entry<String, Object> entry : json.entrySet()) {
            switch (entry.getKey()) {
                case "idtarefa":
                    idtarefa = Integer.valueOf(entry.getValue().toString());
                    break;
                case "nometarefa":
                    nometarefa = entry.getValue().toString();
                    break;
                case "custo":
                    custo = BigDecimal.valueOf(Double.parseDouble(entry.getValue().toString().replace(',', '.')));
                    break;
                case "datalimite":
                    datalimite = entry.getValue().toString();
                    break;
            }
            System.out.println(entry.getKey() + " : " + entry.getValue().toString());
        }

        System.out.println("-------- editarTarefa -------- ");
        System.out.println(idtarefa);
        System.out.println(nometarefa);
        System.out.println(custo);
        System.out.println(datalimite);

        ok = tarefaRepository.editarTarefa(idtarefa, nometarefa, custo, datalimite);
        System.out.println(ok);

        return new ResponseEntity<>(ok, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/apagar", method = RequestMethod.POST)
    public ResponseEntity<Boolean> deleteTarefa(@RequestBody Map<String, Object> json) throws Exception {

        Boolean ok = false;
        System.out.println(json);

        Integer idtarefa = 0;
        for (Map.Entry<String, Object> entry : json.entrySet()) {
            switch (entry.getKey()) {
                case "idtarefa":
                    idtarefa = Integer.valueOf(entry.getValue().toString());
                    break;
            }
            System.out.println(entry.getKey() + " : " + entry.getValue().toString());
        }

        System.out.println("-------- delete Tarefa -------- ");
        System.out.println(idtarefa);

        ok = tarefaRepository.deleteTarefa(idtarefa);
        System.out.println(ok);

        return new ResponseEntity<>(ok, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/ordem", method = RequestMethod.POST)
    public ResponseEntity<Boolean> ordemTarefa(@RequestBody Map<String, Object> json) throws Exception {

        Boolean ok = false;
        System.out.println(json);

        Integer id1 = 0;
        Integer id2 = 0;
        for (Map.Entry<String, Object> entry : json.entrySet()) {
            switch (entry.getKey()) {
                case "id1":
                    id1 = Integer.parseInt(entry.getValue().toString());
                    break;
                case "id2":
                    id2 = Integer.parseInt(entry.getValue().toString());
                    break;
            }
            System.out.println(entry.getKey() + " : " + entry.getValue().toString());
        }

        System.out.println("-------- ordem Tarefa -------- ");
        System.out.println(id1);
        System.out.println(id2);

        ok = tarefaRepository.ordemTarefa(id1, id2);
        System.out.println(ok);

        return new ResponseEntity<>(ok, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/ordembt", method = RequestMethod.POST)
    public ResponseEntity<Boolean> ordemTarefabotao(@RequestBody Map<String, Object> json) throws Exception {

        Boolean ok = false;
        System.out.println(json);

        Integer id = 0;
        String mov = "D";
        for (Map.Entry<String, Object> entry : json.entrySet()) {
            switch (entry.getKey()) {
                case "id":
                    id = Integer.parseInt(entry.getValue().toString());
                    break;
                case "mov":
                    mov = entry.getValue().toString();
                    break;
            }
            System.out.println(entry.getKey() + " : " + entry.getValue().toString());
        }

        System.out.println("-------- ordem Tarefa Botão -------- ");
        System.out.println(id);
        System.out.println(mov);

        ok = tarefaRepository.ordemTarefabotao(id, mov);
        System.out.println(ok);

        return new ResponseEntity<>(ok, HttpStatus.OK);
    }
}
