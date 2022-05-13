package br.com.fabio.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedStoredProcedureQueries;
import javax.persistence.NamedStoredProcedureQuery;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureParameter;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Tarefa")
@Data
@NamedStoredProcedureQueries({
        @NamedStoredProcedureQuery(name = "getAllTarefas", procedureName = "seleciona_tarefas", resultClasses = Tarefa.class),
        @NamedStoredProcedureQuery(name = "getTarefa", procedureName = "seleciona_tarefa", resultClasses = Tarefa.class, parameters = {
                @StoredProcedureParameter(name = "idtarefa", type = Integer.class, mode = ParameterMode.IN)
        }),
        @NamedStoredProcedureQuery(name = "deleteTarefa", procedureName = "delete_tarefa", resultClasses = Tarefa.class, parameters = {
                @StoredProcedureParameter(name = "idtarefa", type = Integer.class, mode = ParameterMode.IN)
        }),
        @NamedStoredProcedureQuery(name = "ordemTarefa", procedureName = "altera_ordem_apresentacao", resultClasses = Tarefa.class, parameters = {
                @StoredProcedureParameter(name = "idtarefa", type = Integer.class, mode = ParameterMode.IN),
                @StoredProcedureParameter(name = "idtarefa1", type = Integer.class, mode = ParameterMode.IN)
        })
})
public class Tarefa implements Serializable {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idtarefa")
    private Integer idtarefa;

    @Column(name = "nometarefa")
    private String nometarefa;

    @Column(name = "custo")
    private BigDecimal custo;

    @Column(name = "datalimite")
    private Date datalimite;

    @Column(name = "ordemapresentacao")
    private Integer ordemapresentacao;
}
