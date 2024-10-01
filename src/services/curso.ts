import { db } from "../config/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";

const CursoService = {
    criarCurso: async (nomeCurso: string, resumo: string) => {
        try {
            const docRef = await addDoc(collection(db, "Curso"), {
                nomeCurso,
                resumo
            });
            return { sucesso: true, id: docRef.id };
        } catch (error) {
            console.error("Erro ao criar curso:", error);
            return { sucesso: false };
        }
    },

    buscarCursos: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Curso"));
            const cursos = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                nomeCurso: doc.data().nomeCurso,
                resumo: doc.data().resumo
            }));
            return { sucesso: true, cursos };
        } catch (error) {
            console.error("Erro ao buscar cursos:", error);
            return { sucesso: false, cursos: [] };
        }
    },

    deletarCurso: async (id: string) => {
        try {
            await deleteDoc(doc(db, "Curso", id));
            return { sucesso: true };
        } catch (error) {
            console.error("Erro ao deletar curso:", error);
            return { sucesso: false };
        }
    },

    editarCurso: async (id: string, nomeCurso: string, resumo: string) => {
        try {
            const cursoRef = doc(db, "Curso", id);
            await updateDoc(cursoRef, { nomeCurso, resumo });
            return { sucesso: true };
        } catch (error) {
            console.error("Erro ao editar curso:", error);
            return { sucesso: false };
        }
    },

    // Função para detalhar um curso pelo ID
    detalharCurso: async (id: string) => {
        try {
            const cursoDoc = await getDoc(doc(db, "Curso", id));
            if (cursoDoc.exists()) {
                return { sucesso: true, curso: { id: cursoDoc.id, ...cursoDoc.data() } };
            } else {
                return { sucesso: false, mensagem: "Curso não encontrado." };
            }
        } catch (error) {
            console.error("Erro ao buscar curso:", error);
            return { sucesso: false, mensagem: "Erro ao buscar curso." };
        }
    }
};

export default CursoService;
