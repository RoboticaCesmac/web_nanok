import { db } from "@/config/firebase";
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc } from "firebase/firestore";

interface Unidade {
    id: string;
    nomeUnidade: string;
    referenciaCurso: string; // Curso ID
    nomeCurso: string; 
}

const UnidadeService = {
    async buscarUnidades() {
        const unidadesList: Unidade[] = [];
        const unidadesRef = collection(db, "Unidade");

        const unidadesSnapshot = await getDocs(unidadesRef);
        for (const unidadeDoc of unidadesSnapshot.docs) {
            const unidadeData = unidadeDoc.data();
            const cursoRef = unidadeData.referenciaCurso;

            // Buscando o nome do curso
            const cursoSnapshot = await getDoc(cursoRef);
            const nomeCurso = cursoSnapshot.exists() ? cursoSnapshot.data().nomeCurso : "Curso não encontrado";

            unidadesList.push({
                id: unidadeDoc.id,
                nomeUnidade: unidadeData.nomeUnidade,
                referenciaCurso: cursoRef.id, 
                nomeCurso, 
            });
        }

        return { sucesso: true, unidades: unidadesList };
    },

    async criarUnidade(nomeUnidade: string, referenciaCurso: string) {
        try {
            const cursoRef = doc(db, "Curso", referenciaCurso);
            const docRef = await addDoc(collection(db, "Unidade"), {
                nomeUnidade,
                referenciaCurso: cursoRef, 
                progresso: 0, 
            });
            return { sucesso: true, id: docRef.id };
        } catch (error) {
            console.error("Erro ao criar unidade: ", error);
            return { sucesso: false };
        }
    },

    async deletarUnidade(id: string) {
        try {
            const unidadeRef = doc(db, "Unidade", id);
            await deleteDoc(unidadeRef);
            return { sucesso: true };
        } catch (error) {
            console.error("Erro ao deletar unidade: ", error);
            return { sucesso: false };
        }
    },

};

export default UnidadeService;
