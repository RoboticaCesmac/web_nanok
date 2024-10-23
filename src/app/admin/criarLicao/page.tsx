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
  const [imagem, setImagem] = useState<File | null>(null); // Novo estado para a imagem

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

    // Verificando se já existe uma lição com a mesma ordem na unidade
    const licoesExistentes = await LicaoService.buscarLicoesPorUnidade(unidade);
    const licaoExistente = licoesExistentes.find(licao => licao.ordem === ordem);

    if (licaoExistente) {
      alert(`Já existe uma lição com a ordem ${ordem} na unidade selecionada.`);
      return;
    }

    try {
      let imagemUrl = "";

      // Se houver uma imagem, faz o upload
      if (imagem) {
        imagemUrl = await LicaoService.uploadImagem(imagem);
        console.log("Imagem enviada com sucesso:", imagemUrl);
      }

      const { sucesso, id, mensagem } = await LicaoService.criarLicao({
        titulo,
        conteudo: conteudo || "",
        unidade,
        ordem,
        imagemUrl, // Adiciona a URL da imagem ao criar a lição
      });

      if (sucesso) {
        alert(`Lição criada com ID: ${id}`);
        setTitulo("");
        setConteudo("");
        setUnidade(null);
        setOrdem(null);
        setImagem(null); // Limpa o campo de imagem
      } else {
        alert(mensagem || "Falha ao criar a lição. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao criar lição:", error);
      alert("Ocorreu um erro ao criar a lição. Verifique os logs.");
    }
  };

  return (
    <main>
      <AdminHeader titulo="Criar Lição" />
      <div className="d-flex px-2 py-2">
        <input
          type="text"
          placeholder="Título da Lição"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value.slice(0, 25))}
        />
      </div>
      <div className="d-flex flex-column justify-content-center px-2 py-2">
        <textarea
          placeholder="Conteúdo da Lição"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value.slice(0, 350))}
          maxLength={350}
        />
        <div style={{ fontSize: "12px", color: "#666" }}>
          {`${conteudo.length}/350`}
        </div>
      </div>
      <div className="d-flex px-2 py-2">
        <input
          type="number"
          placeholder="Ordem (inteiro)"
          value={ordem || ""}
          onChange={(e) => setOrdem(Number(e.target.value))}
        />
      </div>
      <div className="d-flex px-2 py-2">
        <select onChange={(e) => setUnidade(e.target.value)} value={unidade || ""}>
          <option value="">Selecione uma unidade</option>
          {unidades.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nomeUnidade}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex px-2 py-2">
        <input
          type="file"
          id="file"
          className="file-input" 
          onChange={(e) => setImagem(e.target.files ? e.target.files[0] : null)}
        />
      </div>

      <div className=" py-3 ">
        <button
          onClick={criarLicao}
          className="btn btn-primary"
        >
          Criar Lição
        </button>
      </div>
    </main>
  );
}
