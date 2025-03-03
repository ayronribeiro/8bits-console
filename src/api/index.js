// api/index.js
import { API_URL } from '../config';

// Função para buscar os dados do Header
export const getHeaderData = async () => {
  try {
    const response = await fetch(`${API_URL}/headers?populate=*`);
    const data = await response.json();
    return data.data; // Retorna a lista de dados do cabeçalho
  } catch (error) {
    console.error('Erro ao buscar dados do cabeçalho:', error);
    return [];
  }
};

// Função para buscar os dados da Hero Section
export const getHeroSectionData = async () => {
  try {
    const response = await fetch(`${API_URL}/hero-sections?populate=*`);
    const data = await response.json();
    return data.data; // Retorna a lista de dados da hero section
  } catch (error) {
    console.error('Erro ao buscar dados da hero section:', error);
    return [];
  }
};

