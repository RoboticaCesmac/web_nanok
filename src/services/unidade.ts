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
            const cursoSnapshot:any = await getDoc(cursoRef);
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

    async buscarCursos() {
        const cursosList: any[] = [];
        const cursosRef = collection(db, "Curso"); // Coleção de cursos

        const cursosSnapshot = await getDocs(cursosRef);
        cursosSnapshot.forEach((cursoDoc) => {
            const cursoData = cursoDoc.data();
            cursosList.push({
                id: cursoDoc.id,
                nomeCurso: cursoData.nomeCurso || "Sem Nome", // Utilize um nome padrão se não houver
            });
        });

        return cursosList;
    },

    async buscarUnidadePorId(id: string) {
        const unidadeRef = doc(db, "Unidade", id);
        const unidadeSnapshot = await getDoc(unidadeRef);
        if (unidadeSnapshot.exists()) {
            const unidadeData = unidadeSnapshot.data();
            return { sucesso: true, unidade: { id: unidadeSnapshot.id, ...unidadeData } };
        } else {
            return { sucesso: false, mensagem: "Unidade não encontrada" };
        }
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
