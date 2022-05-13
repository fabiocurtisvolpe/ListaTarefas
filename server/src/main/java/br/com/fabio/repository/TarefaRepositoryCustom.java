package br.com.fabio.repository;

import java.math.BigDecimal;
import java.util.List;
import br.com.fabio.model.Tarefa;

public interface TarefaRepositoryCustom {

    List<Tarefa> getAllTarefas();
    List<Tarefa> getTarefa(Integer id);
    Boolean nTarefa(String nometarefa, BigDecimal custo, String datalimite);
    Boolean editarTarefa(Integer id, String nometarefa, BigDecimal custo, String datalimite);
    Boolean deleteTarefa(Integer id);
    Boolean ordemTarefa(Integer id, Integer id1);
    Boolean ordemTarefabotao(Integer id, String mov);
}