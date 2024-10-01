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
  const { id } = useParams() as { id: string }; // Definindo o tipo do parâmetro id
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
    <main>
      <AdminHeader titulo="Editar Curso" />
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
      <button onClick={handleSalvar}>Salvar Alterações</button>
    </main>
  );
}
