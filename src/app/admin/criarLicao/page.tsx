// URL/admin/criarPagina
"use client"; 

import React, { useState, useEffect } from "react";
import LicaoService from "@/services/licao";
import { AdminHeader } from "../components";

export default function CriarLicao() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState("");
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

    const { sucesso, id, mensagem } = await LicaoService.criarLicao({
      titulo,
      conteudo: conteudo || "",
      imagem: imagem || "",
      unidade,
      ordem,
    });

    if (sucesso) {
      alert(`Lição criada com ID: ${id}`);
      setTitulo("");
      setConteudo("");
      setImagem("");
      setUnidade(null);
      setOrdem(null);
    } else {
      alert(mensagem || "Falha ao criar a lição. Tente novamente.");
    }
  };

  return (
    <main>
      <AdminHeader titulo='Criar lição' />
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
          onChange={(e) => setConteudo(e.target.value.slice(0, 255))}
          maxLength={255}
        />
        <div style={{ fontSize: '12px', color: '#666' }}>
          {`${conteudo.length}/255`}
        </div>
      </div>
      <div className="d-flex px-2 py-2">
        <input
          type="text"
          placeholder="URL da Imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />
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
              className='btn btn-outline-primary btn-sm m-2'
            >
              {item.nomeUnidade}
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
