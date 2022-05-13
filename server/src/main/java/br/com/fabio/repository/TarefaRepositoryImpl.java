package br.com.fabio.repository;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceContext;
import javax.persistence.QueryTimeoutException;
import javax.persistence.StoredProcedureQuery;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import br.com.fabio.model.Tarefa;

public class TarefaRepositoryImpl implements TarefaRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    @SuppressWarnings("unchecked")
    public List<Tarefa> getAllTarefas() {
        System.out.println("--------- getAllTarefas -----------");
        try {
            StoredProcedureQuery storedProcedureQuery = em.createNamedStoredProcedureQuery("getAllTarefas");
            return storedProcedureQuery.getResultList();
        } catch (QueryTimeoutException ex) {
            return null;
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Tarefa> getTarefa(Integer id) {
        System.out.println("--------- getTarefa -----------");
        System.out.println(id);
        try {
            StoredProcedureQuery storedProcedureQuery = em.createNamedStoredProcedureQuery("getTarefa");
            storedProcedureQuery.setParameter("idtarefa", id);
            return storedProcedureQuery.getResultList();
        } catch (QueryTimeoutException ex) {
            return null;
        }
    }

    @Override
    public Boolean nTarefa(String nometarefa, BigDecimal custo, String datalimite) {
        Boolean ok = false;
        System.out.println("--------- novaTarefa -----------");
        System.out.println(nometarefa);
        System.out.println(custo);
        System.out.println(datalimite);

        try {
            Date dt = Date.valueOf(datalimite);

            StoredProcedureQuery storedProcedureQuery = em
                    .createStoredProcedureQuery("nova_tarefa", Tarefa.class)
                    .registerStoredProcedureParameter("nometarefa", String.class, ParameterMode.IN)
                    .registerStoredProcedureParameter("custo", BigDecimal.class, ParameterMode.IN)
                    .registerStoredProcedureParameter("datalimite", Date.class, ParameterMode.IN)
                    .registerStoredProcedureParameter("ok", Boolean.class, ParameterMode.OUT);
            storedProcedureQuery.setParameter("nometarefa", nometarefa);
            storedProcedureQuery.setParameter("custo", custo);
            storedProcedureQuery.setParameter("datalimite", dt);
            storedProcedureQuery.execute();
            ok = (Boolean) storedProcedureQuery.getOutputParameterValue("ok");
            System.out.println(ok);

            return ok;
        } catch (QueryTimeoutException ex) {
            return false;
        }
    }

    @Override
    public Boolean editarTarefa(Integer id, String nometarefa, BigDecimal custo, String datalimite) {
        Boolean ok = false;
        System.out.println("--------- editarTarefa -----------");
        System.out.println(id);
        System.out.println(nometarefa);
        System.out.println(custo);
        System.out.println(datalimite);

        try {

            Date dt = Date.valueOf(datalimite);

            StoredProcedureQuery storedProcedureQuery = em
                    .createStoredProcedureQuery("editar_tarefa", Tarefa.class)
                    .registerStoredProcedureParameter("idtarefa", Integer.class, ParameterMode.IN)
                    .registerStoredProcedureParameter("nometarefa", String.class, ParameterMode.IN)
                    .registerStoredProcedureParameter("custo", BigDecimal.class, ParameterMode.IN)
                    .registerStoredProcedureParameter("datalimite", Date.class, ParameterMode.IN)
                    .registerStoredProcedureParameter("ok", Boolean.class, ParameterMode.OUT);
            storedProcedureQuery.setParameter("idtarefa", id);
            storedProcedureQuery.setParameter("nometarefa", nometarefa);
            storedProcedureQuery.setParameter("custo", custo);
            storedProcedureQuery.setParameter("datalimite", dt);
            storedProcedureQuery.execute();
            ok = (Boolean) storedProcedureQuery.getOutputParameterValue("ok");

            return ok;
        } catch (QueryTimeoutException ex) {
            return false;
        }
    }

    @Override
    public Boolean deleteTarefa(Integer id) {
        System.out.println("--------- deleteTarefa -----------");
        System.out.println(id);
        try {
            StoredProcedureQuery storedProcedureQuery = em.createNamedStoredProcedureQuery("deleteTarefa");
            storedProcedureQuery.setParameter("idtarefa", id);
            storedProcedureQuery.execute();
            return true;
        } catch (QueryTimeoutException ex) {
            System.out.println(ex.toString());
            return false;
        }
    }

    @Override
    public Boolean ordemTarefa(Integer id1, Integer id2) {
        System.out.println("--------- ordemTarefa -----------");
        System.out.println(id1);
        System.out.println(id2);

        try {
            StoredProcedureQuery storedProcedureQuery = em.createNamedStoredProcedureQuery("ordemTarefa");
            storedProcedureQuery.setParameter("idtarefa", id1);
            storedProcedureQuery.setParameter("idtarefa1", id2);
            storedProcedureQuery.execute();
            return true;
        } catch (QueryTimeoutException ex) {
            System.out.println(ex.toString());
            return false;
        }
    }

    @Override
    public Boolean ordemTarefabotao(Integer id, String mov) {
        System.out.println("--------- ordemTarefa Botao -----------");
        System.out.println(id);
        System.out.println(mov);

        try {
            StoredProcedureQuery storedProcedureQuery = em
                    .createStoredProcedureQuery("altera_ordem_aparesentacao_botao", Tarefa.class)
                    .registerStoredProcedureParameter("idtarefa", Integer.class, ParameterMode.IN)
                    .registerStoredProcedureParameter("mov", String.class, ParameterMode.IN);
            storedProcedureQuery.setParameter("idtarefa", id);
            storedProcedureQuery.setParameter("mov", mov);
            storedProcedureQuery.execute();
    
            return true;
        } catch (QueryTimeoutException ex) {
            System.out.println(ex.toString());
            return false;
        }
    }
}
