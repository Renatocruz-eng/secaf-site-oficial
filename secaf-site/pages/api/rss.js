import Parser from 'rss-parser';

const parser = new Parser();

export default async function handler(req, res) {
  try {
    const feed = await parser.parseURL('https://www.agrolink.com.br/rss/noticias.xml');
    const noticias = feed.items.slice(0, 3).map(item => ({
      titulo: item.title,
      link: item.link,
      descricao: item.contentSnippet || item.content || '',
      imagem: extrairImagem(item.content || '')
    }));

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    res.status(200).json({ noticias });
  } catch (error) {
    console.error('Erro ao processar RSS:', error);
    res.status(500).json({ erro: 'Falha ao buscar notícias.' });
  }
}

function extrairImagem(html) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return match ? match[1] : null;
}