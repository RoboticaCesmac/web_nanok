// URL/admin/criarCurso
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
    <main>
      <AdminHeader titulo="Criar Curso" />
      <div className="d-flex px-2 py-2">
        <input
          type="text"
          placeholder="Nome do Curso"
          value={nomeCurso}
          onChange={(e) => setNomeCurso(e.target.value)}
        />
      </div>
      <div className="d-flex flex-column justify-content-center d-flex px-2 py-2">
        <textarea
          placeholder="Resumo do Curso"
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
          maxLength={255}
        />
        <div style={{ fontSize: "12px", color: "#666" }}>
          {`${resumo.length}/255`}
        </div>
      </div>
      <button onClick={criarCurso}>Criar Curso</button>
    </main>
  );
}
