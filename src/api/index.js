// api/index.js
import { API_URL } from '../config';

// Função para buscar os dados do Header
export const getHeaderData = async () => {
  try {
    const response = await fetch(`${API_URL}/headers?populate=*`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || []; // Retorna um array vazio se data.data for null/undefined
  } catch (error) {
    console.error('Erro ao buscar dados do cabeçalho:', error);
    return []; // Retorna um array vazio em caso de erro
  }
};

// Função para buscar os dados da Hero Section
export const getHeroSectionData = async () => {
  try {
    const response = await fetch(`${API_URL}/hero-sections?populate=*`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || []; // Retorna um array vazio se data.data for null/undefined
  } catch (error) {
    console.error('Erro ao buscar dados da hero section:', error);
    return []; // Retorna um array vazio em caso de erro
  }
};

