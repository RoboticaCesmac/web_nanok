// URL/admin/criarUnidade
"use client";

import React, { useState, useEffect } from "react";
import UnidadeService from "@/services/unidade"; // Importa o service de unidade
import { AdminHeader } from "../components";

export default function CriarUnidade() {
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [referenciaCurso, setReferenciaCurso] = useState<string | null>(null);
  const [cursos, setCursos] = useState<any[]>([]);

  // Carrega os cursos ao montar o componente
  useEffect(() => {
    const fetchCursos = async () => {
      const cursosList = await UnidadeService.buscarCursos(); // Chama a função para buscar cursos
      console.log("Cursos carregados:", cursosList); // Verifica se os cursos estão sendo carregados
      setCursos(cursosList);
    };
    fetchCursos();
  }, []);

  const criarUnidade = async () => {
    if (!nomeUnidade || !referenciaCurso) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const { sucesso, id, mensagem } = await UnidadeService.criarUnidade(
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
    <main>
      <AdminHeader titulo='Criar Unidade' />
      <div className="d-flex px-2 py-2">
        <input
          type="text"
          placeholder="Nome da Unidade"
          value={nomeUnidade}
          onChange={(e) => setNomeUnidade(e.target.value.slice(0, 50))} // Limita a 50 caracteres
        />
      </div>
      <div className="d-flex px-1 py-2">
        <label>Selecione o Curso:</label>
        {cursos.length > 0 ? (
          cursos.map((curso) => (
            <button
              key={curso.id}
              onClick={() => setReferenciaCurso(curso.id)}
              className={`btn ${referenciaCurso === curso.id ? 'btn-primary' : 'btn-outline-primary'} btn-sm m-2`}
            >
              {curso.nomeCurso || "Sem Nome"}
            </button>
          ))
        ) : (
          <p>Nenhum curso disponível ou carregando...</p>
        )}
      </div>
      <button className="btn btn-primary" onClick={criarUnidade}>Criar Unidade</button>
    </main>
  );
}
