// URL/admin/criarUnidade
"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { addDoc, collection, getDocs, doc } from "firebase/firestore";
import { AdminHeader } from "../components";

export default function CriarUnidade() {
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [curso, setCurso] = useState(null);
  const [cursos, setCursos] = useState([]);

  // Função para buscar cursos do Firestore
  const fetchCursos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Curso"));
      const cursosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCursos(cursosList);
    } catch (error) {
      console.error("Erro ao buscar cursos: ", error);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const criarUnidade = async () => {
    if (!nomeUnidade || !curso) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const cursoRef = doc(db, "Curso", curso);
      const docRef = await addDoc(collection(db, "Unidade"), {
        nomeUnidade: nomeUnidade,
        referenciaCurso: cursoRef, // Referência ao curso
        progresso: 0, // Progresso inicial (pode ser ajustado conforme necessário)
      });

      alert(`Unidade criada com ID: ${docRef.id}`);
      // Limpa os campos
      setNomeUnidade("");
      setCurso(null);
    } catch (error) {
      alert("Falha ao criar a unidade. Tente novamente.");
      console.error("Erro ao criar unidade: ", error);
    }
  };

  return (
    <main>
      <AdminHeader titulo='Criar Unidade' />
      <div >
        <input
          type="text"
          placeholder="Nome da Unidade"
          value={nomeUnidade}
          onChange={(e) => setNomeUnidade(e.target.value)}
        />
      </div>
      <div>
        <label>Selecione o Curso:</label>
        {cursos.length > 0 ? (
          cursos.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurso(item.id)}
              style={{
                backgroundColor: curso === item.id ? "#ddd" : "#fff",
                margin: "5px",
              }}
            >
              {item.nomeCurso}
            </button>
          ))
        ) : (
          <p>Carregando cursos...</p>
        )}
      </div>
      <button onClick={criarUnidade}>Criar Unidade</button>
    </main>
  );
}
