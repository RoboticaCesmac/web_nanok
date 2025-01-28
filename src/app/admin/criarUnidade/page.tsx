// URL/admin/criarUnidade
"use client";

import React, { useState, useEffect } from "react";
import UnidadeService from "@/services/unidade";
import { AdminHeader } from "../components";

export default function CriarUnidade() {
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [referenciaCurso, setReferenciaCurso] = useState<string | null>(null);
  const [cursos, setCursos] = useState<any[]>([]);

  useEffect(() => {
    const fetchCursos = async () => {
      const cursosList = await UnidadeService.buscarCursos();
      console.log("Cursos carregados:", cursosList);
      setCursos(cursosList);
    };
    fetchCursos();
  }, []);

  const criarUnidade = async () => {
    if (!nomeUnidade || !referenciaCurso) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const { sucesso, id, mensagem } :any = await UnidadeService.criarUnidade(
      nomeUnidade,
      referenciaCurso
    );

    if (sucesso) {
      alert(`Unidade criada com ID: ${id}`);
      setNomeUnidade("");
      setReferenciaCurso(null);
    } else {
      alert(mensagem || "Falha ao criar a unidade. Tente novamente.");
    }
  };

  return (
    <main className="container mt-4">
      {/* Adicionando o AdminHeader */}
      <AdminHeader titulo="Criar Unidade" />
      <div className="mb-3">
        <label htmlFor="nomeUnidade" className="form-label">Nome da Unidade</label>
        <input
          type="text"
          id="nomeUnidade"
          className="form-control"
          placeholder="Digite o nome da unidade"
          value={nomeUnidade}
          onChange={(e) => setNomeUnidade(e.target.value.slice(0, 50))}
        />
        <small className="text-muted d-block mt-1">
          Máximo de 50 caracteres
        </small>
      </div>
      <div className="mb-3">
        <label className="form-label">Selecione o Curso:</label>
        {cursos.length > 0 ? (
          <div className="row">
            {cursos.map((curso, index) => (
              <div className="col-3 mb-2" key={curso.id}>
                <button
                  onClick={() => setReferenciaCurso(curso.id)}
                  className={`btn ${
                    referenciaCurso === curso.id ? "btn-primary" : "btn-outline-primary"
                  } w-100`}
                >
                  {curso.nomeCurso || "Sem Nome"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">Nenhum curso disponível ou carregando...</p>
        )}
      </div>
      <button className="btn btn-primary w-100" onClick={criarUnidade}>
        Criar Unidade
      </button>
    </main>
  );
}
