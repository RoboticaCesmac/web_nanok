"use client"; 

import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { addDoc, collection, getDocs, doc } from "firebase/firestore";
import { AdminHeader } from "../components";

export default function CriarLicao() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState("");
  const [unidade, setUnidade] = useState(null);
  const [ordem, setOrdem] = useState(null);
  const [unidades, setUnidades] = useState([]);

  const fetchUnidades = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Unidade"));
      const unidadesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUnidades(unidadesList);
    } catch (error) {
      console.error("Erro ao buscar unidades: ", error);
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  const criarLicao = async () => {
    if (!titulo || !conteudo || !imagem || !unidade || ordem === null) {
      alert("Por favor, preencha todos os campos, incluindo a ordem.");
      return;
    }

    try {
      const unidadeRef = doc(db, "Unidade", unidade);
      const docRef = await addDoc(collection(db, "Licao"), {
        titulo: titulo,
        conteudo: conteudo,
        imagem: imagem,
        unidade: unidadeRef,
        ordem: ordem,
      });

      alert(`Lição criada com ID: ${docRef.id}`);
      // Limpa os campos
      setTitulo("");
      setConteudo("");
      setImagem("");
      setUnidade(null);
      setOrdem(null);
    } catch (error) {
      alert("Falha ao criar a lição. Tente novamente.");
      console.error("Erro ao criar lição: ", error);
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
          onChange={(e) => setConteudo(e.target.value.slice(0, 255))} // Limita a 255 caracteres
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
              style={{
                backgroundColor: unidade === item.id ? "#ddd" : "#fff",
                margin: "5px",
              }}
            >
              {item.nomeUnidade}
            </button>
          ))
        ) : (
          <p>Carregando unidades...</p>
        )}
      </div>
      <button onClick={criarLicao}>Criar Lição</button>
    </main>
  );
}
