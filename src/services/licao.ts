// src/services/licao.ts
import { db } from "@/config/firebase";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";

const LicaoService = {
    async buscarUnidades() {
        try {
            const unidadesList: any[] = [];
            const querySnapshot = await getDocs(collection(db, "Unidade"));

            querySnapshot.forEach((doc) => {
                unidadesList.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            console.log("Unidades buscadas: ", unidadesList); // Verifica se está retornando as unidades corretamente
            return unidadesList;
        } catch (error) {
            console.error("Erro ao buscar unidades: ", error);
            return [];
        }
    },

    async criarLicao({ titulo, conteudo, imagem, unidade, ordem }: { titulo: string; conteudo?: string; imagem?: string; unidade: string; ordem: number; }) {
        try {
            // Verifica se já existe uma lição com a mesma ordem
            const existingLessons = await this.buscarLicoesPorOrdem(ordem);
            if (existingLessons.length > 0) {
                return { sucesso: false, mensagem: "Já existe uma lição nessa ordem." };
            }

            const unidadeRef = doc(db, "Unidade", unidade);
            const docRef = await addDoc(collection(db, "Licao"), {
                titulo,
                conteudo,
                imagem,
                unidade: unidadeRef,
                ordem,
            });

            return { sucesso: true, id: docRef.id, mensagem: "Lição criada com sucesso!" };
        } catch (error) {
            console.error("Erro ao criar lição: ", error);
            return { sucesso: false, mensagem: "Falha ao criar a lição. Tente novamente." };
        }
    },

    async buscarLicoesPorOrdem(ordem: number) {
        const querySnapshot = await getDocs(collection(db, "Licao"));
        return querySnapshot.docs.filter(doc => doc.data().ordem === ordem);
    },
};

export default LicaoService;
