"use client";

import React, { useState, useEffect } from "react";
import LicaoService from "@/services/licao";
import { AdminHeader } from "../components";

export default function CriarLicao() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [unidade, setUnidade] = useState<string | null>(null);
  const [ordem, setOrdem] = useState<number | null>(null);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [imagem, setImagem] = useState<File | null>(null);

  useEffect(() => {
    const fetchUnidades = async () => {
      const unidadesList = await LicaoService.buscarUnidades();
      setUnidades(unidadesList);
    };
    fetchUnidades();
  }, []);

  const criarLicao = async () => {
    if (!titulo || ordem === null || !unidade) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const licoesExistentes = await LicaoService.buscarLicoesPorUnidade(unidade);
    const licaoExistente = licoesExistentes.find(licao => licao.ordem === ordem);

    if (licaoExistente) {
      alert(`Já existe uma lição com a ordem ${ordem} na unidade selecionada.`);
      return;
    }

    try {
      let imagemUrl = "";

      if (imagem) {
        imagemUrl = await LicaoService.uploadImagem(imagem);
        console.log("Imagem enviada com sucesso:", imagemUrl);
      }

      const { sucesso, id, mensagem } = await LicaoService.criarLicao({
        titulo,
        conteudo: conteudo || "",
        unidade,
        ordem,
        imagemUrl,
      });

      if (sucesso) {
        alert(`Lição criada com ID: ${id}`);
        setTitulo("");
        setConteudo("");
        setUnidade(null);
        setOrdem(null);
        setImagem(null);
      } else {
        alert(mensagem || "Falha ao criar a lição. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao criar lição:", error);
      alert("Ocorreu um erro ao criar a lição. Verifique os logs.");
    }
  };

  return (
    <main className="container mt-4">
      {/* Usando o AdminHeader com o título da página */}
      <AdminHeader titulo="Criar Lição" />

      <div className="mb-3">
        <label htmlFor="titulo" className="form-label">Título da Lição</label>
        <input
          type="text"
          id="titulo"
          className="form-control"
          placeholder="Digite o título da lição"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value.slice(0, 25))}
          maxLength={25}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="conteudo" className="form-label">Conteúdo da Lição</label>
        <textarea
          id="conteudo"
          className="form-control"
          placeholder="Digite o conteúdo da lição"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value.slice(0, 350))}
          maxLength={350}
        />
        <small className="text-muted d-block mt-1">
          {`${conteudo.length}/350 caracteres`}
        </small>
      </div>

      <div className="mb-3">
        <label htmlFor="ordem" className="form-label">Ordem da Lição</label>
        <input
          type="number"
          id="ordem"
          className="form-control"
          placeholder="Digite a ordem (inteiro)"
          value={ordem || ""}
          onChange={(e) => setOrdem(Number(e.target.value))}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="unidade" className="form-label">Selecione a Unidade</label>
        <select
          id="unidade"
          className="form-select"
          onChange={(e) => setUnidade(e.target.value)}
          value={unidade || ""}
        >
          <option value="">Selecione uma unidade</option>
          {unidades.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nomeUnidade}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="imagem" className="form-label">Upload de Imagem</label>
        <input
          type="file"
          id="imagem"
          className="form-control"
          onChange={(e) => setImagem(e.target.files ? e.target.files[0] : null)}
        />
      </div>

      <button onClick={criarLicao} className="btn btn-primary w-100 mt-3">
        Criar Lição
      </button>
    </main>
  );
}
