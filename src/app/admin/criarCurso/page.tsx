"use client"; 

import CursoService from "@/services/curso";
import { useState } from "react";
import { AdminHeader } from "../components";

export default function CriarCurso() {
  const [nomeCurso, setNomeCurso] = useState("");
  const [resumo, setResumo] = useState("");

  const criarCurso = async () => {
    if (!nomeCurso || !resumo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const { sucesso, id } = await CursoService.criarCurso(nomeCurso, resumo);
      if (sucesso) {
        alert(`Curso criado com ID: ${id}`);
        setNomeCurso("");
        setResumo("");
      } else {
        alert("Falha ao criar o curso.");
      }
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      alert("Erro ao criar o curso. Tente novamente.");
    }
  };

  return (
    <main className="container mt-4">
      {/* Exibe o título com o AdminHeader */}
      <AdminHeader titulo="Criar Curso" />

      {/* Formulário para criar o curso */}
      <div className="mb-3">
        <label htmlFor="nomeCurso" className="form-label">Nome do Curso</label>
        <input
          type="text"
          id="nomeCurso"
          className="form-control"
          placeholder="Digite o nome do curso"
          value={nomeCurso}
          onChange={(e) => setNomeCurso(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="resumo" className="form-label">Resumo do Curso</label>
        <textarea
          id="resumo"
          className="form-control"
          placeholder="Digite um resumo do curso"
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
          maxLength={255}
          style={{ height: "150px" }}
        />
        <small className="text-muted">{`${resumo.length}/255`}</small>
      </div>

      <button className="btn btn-primary w-100" onClick={criarCurso}>
        Criar Curso
      </button>
    </main>
  );
}
