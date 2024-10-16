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

    const { sucesso, id, mensagem } = await LicaoService.criarLicao({
      titulo,
      conteudo: conteudo || "",
      unidade,
      ordem,
    });

    if (sucesso) {
      alert(`Lição criada com ID: ${id}`);
      setTitulo("");
      setConteudo("");
      setUnidade(null);
      setOrdem(null);
    } else {
      alert(mensagem || "Falha ao criar a lição. Tente novamente.");
    }
  };

  return (
    <main>
      <AdminHeader titulo='Criar Lição' />
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
          onChange={(e) => setConteudo(e.target.value.slice(0, 450))}
          maxLength={450}
        />
        <div style={{ fontSize: '12px', color: '#666' }}>
          {`${conteudo.length}/450`}
        </div>
      </div>
      <div className="d-flex px-2 py-2">
        <input
          type="number"
          placeholder="Ordem (inteiro)"
          value={ordem || ""}
          onChange={(e) => setOrdem(parseInt(e.target.value, 10))}
        />
      </div>
      <div className="d-flex px-1 py-2">
        <label>Selecione a Unidade:</label>
        {unidades.length > 0 ? (
          unidades.map((item) => (
            <button
              key={item.id}
              onClick={() => setUnidade(item.id)}
              className={`btn ${unidade === item.id ? 'btn-primary' : 'btn-outline-primary'} btn-sm m-2`}
            >
              {item.nomeUnidade || "Sem Nome"}
            </button>
          ))
        ) : (
          <p>Carregando unidades...</p>
        )}
      </div>
      <button className="btn btn-primary" onClick={criarLicao}>Criar Lição</button>
    </main>
  );
}
