package br.com.fabio.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.fabio.model.Tarefa;

public interface TarefaRepository extends CrudRepository<Tarefa, Integer>, TarefaRepositoryCustom {
    
}
