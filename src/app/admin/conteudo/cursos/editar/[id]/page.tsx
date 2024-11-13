"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CursoService from "@/services/curso";
import { AdminHeader } from "@/app/admin/components";

interface Curso {
  id: string;
  nomeCurso: string;
  resumo: string;
}

export default function EditarCurso() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [nomeCurso, setNomeCurso] = useState<string>("");
  const [resumo, setResumo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const buscarCurso = async () => {
      if (!id) return;
      setLoading(true);
      const { sucesso, curso, mensagem } = await CursoService.detalharCurso(id);
      if (sucesso && curso) {
        setNomeCurso(curso.nomeCurso);
        setResumo(curso.resumo);
      } else {
        alert(mensagem || "Erro ao buscar o curso.");
        router.push("/admin/cursos");
      }
      setLoading(false);
    };

    buscarCurso();
  }, [id, router]);

  const handleSalvar = async () => {
    if (!nomeCurso || !resumo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const { sucesso } = await CursoService.editarCurso(id, nomeCurso, resumo);
      if (sucesso) {
        alert("Curso editado com sucesso!");
        router.push("/admin/conteudo/cursos");
      } else {
        alert("Erro ao editar o curso.");
      }
    } catch (error) {
      console.error("Erro ao editar o curso:", error);
      alert("Erro ao editar o curso. Tente novamente.");
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <main className="container mt-4">
      <AdminHeader titulo="Editar Curso" />

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
        <small className="text-muted d-block mt-1">
          {`${resumo.length}/255 caracteres`}
        </small>
      </div>

      <button onClick={handleSalvar} className="btn btn-primary w-100 mt-3">
        Salvar Alterações
      </button>
    </main>
  );
}
