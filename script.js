function cadastro() {
  const emailInput = document.getElementById("email-cadastro");
  const senhaInput = document.getElementById("senha-cadastro");
  const confirmSenhaInput = document.getElementById("confirmacao-senha");
  const apelidoInput = document.getElementById("apelido");
  const generoInput = document.getElementById("genero");
  const idadeInput = document.getElementById("idade");
  const mensagemErro = document.getElementById("mensagem-erro");

  if (!apelidoInput.value || !generoInput.value || !idadeInput.value) {
    if (mensagemErro)
      mensagemErro.textContent = "Preencha todos os campos obrigatórios!";
    return;
  }

  if (senhaInput.value !== confirmSenhaInput.value) {
    if (mensagemErro) mensagemErro.textContent = "As senhas não coincidem!";
    return;
  }

  const dadoscadastro = {
    email: emailInput.value.toLowerCase().trim(),
    senha: senhaInput.value,
    apelido: apelidoInput.value,
    genero: generoInput.value,
    idade: idadeInput.value,
  };

  localStorage.setItem("cadastrousuario", JSON.stringify(dadoscadastro));

  emailInput.value = "";
  senhaInput.value = "";
  confirmSenhaInput.value = "";

  window.location.href = "../login/LogIn.html";
}

function LogIn() {
  const email = document
    .getElementById("email-login")
    .value.toLowerCase()
    .trim();
  const senha = document.getElementById("senha-login").value;
  const mensagemErro = document.getElementById("mensagem-erro");

  const jsonsalvo = localStorage.getItem("cadastrousuario");

  if (!jsonsalvo) {
    if (mensagemErro) mensagemErro.textContent = "Nenhum usuário cadastrado.";
    return;
  }

  const usuario = JSON.parse(jsonsalvo);

  if (usuario.email === email && usuario.senha === senha) {
    localStorage.setItem("usuarioLogado", email);
    window.location.href = "../site/perfil/perfil.html";
  } else {
    if (mensagemErro) mensagemErro.textContent = "Senha ou email incorretos";
  }
}

function logOut() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "../../index.html";
}

function publicar() {
  const emailLogado = localStorage.getItem("usuarioLogado");
  const campoTexto = document.getElementById("texto-blog");

  if (!emailLogado) {
    alert("Você precisa estar logado!");
    return;
  }

  if (!campoTexto || !campoTexto.value.trim()) {
    alert("Escreva algo antes de publicar!");
    return;
  }

  const publicacao = { texto: campoTexto.value };
  localStorage.setItem("blogtexto_" + emailLogado, JSON.stringify(publicacao));
  alert("Postagem do blog salva com sucesso!");
}

function publicarbio() {
  const emailLogado = localStorage.getItem("usuarioLogado");
  const campoBio = document.getElementById("campo-biografia");

  if (!emailLogado) return;

  if (campoBio) {
    const publicacaobio = { texto: campoBio.value };
    localStorage.setItem(
      "biotexto_" + emailLogado,
      JSON.stringify(publicacaobio),
    );
    alert("Biografia salva com sucesso!");
  }
}

function blogunload() {
  const paragrafo = document.getElementById("texto-blog");
  if (!paragrafo) return;

  const emailLogado = localStorage.getItem("usuarioLogado");

  if (emailLogado) {
    const jsonsalvo = localStorage.getItem("blogtexto_" + emailLogado);
    if (jsonsalvo) {
      const usuario = JSON.parse(jsonsalvo);
      paragrafo.value = usuario.texto || "";
    } else {
      paragrafo.value = "";
    }

    const foto1 = localStorage.getItem("salva_foto1_" + emailLogado);
    const foto2 = localStorage.getItem("salva_foto2_" + emailLogado);
    const elementoFoto1 = document.getElementById("fotoPerfil11");
    const elementoFoto2 = document.getElementById("fotoPerfil10");

    if (foto1 && elementoFoto1) elementoFoto1.src = foto1;
    if (foto2 && elementoFoto2) elementoFoto2.src = foto2;
  } else {
    paragrafo.value = "";
  }
}

function salvarStatus(status) {
  const emailLogado = localStorage.getItem("usuarioLogado");
  if (!emailLogado) return;

  localStorage.setItem("status_" + emailLogado, status);
}

function bionload() {
  const emailLogado = localStorage.getItem("usuarioLogado");
  const elementoBio = document.getElementById("campo-biografia");
  const elementoNome = document.getElementById("nome-perfil");
  const elementoIdade = document.getElementById("idade");
  const elementoGenero = document.getElementById("genero");
  const elementoFoto = document.getElementById("fotoPerfil");

  if (!emailLogado) {
    if (elementoBio) elementoBio.value = "";
    if (elementoNome) elementoNome.textContent = "Visitante";
    return;
  }

  const jsonsalvoUsuario = localStorage.getItem("cadastrousuario");
  if (jsonsalvoUsuario) {
    const usuario = JSON.parse(jsonsalvoUsuario);
    if (elementoNome) elementoNome.textContent = usuario.apelido || emailLogado;
    if (elementoIdade && usuario.idade)
      elementoIdade.textContent = usuario.idade + " anos";
    if (elementoGenero && usuario.genero)
      elementoGenero.textContent = "Gênero: " + usuario.genero;
  }

  if (elementoBio) {
    const jsonsalvoBio = localStorage.getItem("biotexto_" + emailLogado);
    if (jsonsalvoBio) {
      const bio = JSON.parse(jsonsalvoBio);
      elementoBio.value = bio.texto || "";
    } else {
      elementoBio.value = "";
    }
  }

  if (elementoFoto) {
    const fotoSalva = localStorage.getItem("fotoperfil_" + emailLogado);
    if (fotoSalva) {
      elementoFoto.src = fotoSalva;
    }
  }

  const statusSalvo = localStorage.getItem("status_" + emailLogado);
  if (statusSalvo) {
    const radio = document.querySelector(
      `input[name="meu-grupo"][value="${statusSalvo}"]`,
    );
    if (radio) radio.checked = true;
  }
}

function salvarEExibirFoto(input, imgId, chaveBase) {
  const emailLogado = localStorage.getItem("usuarioLogado");
  if (!emailLogado) {
    alert("Você precisa estar logado para salvar fotos.");
    input.value = "";
    return;
  }

  const arquivo = input.files[0];
  if (!arquivo) return;

  if (!arquivo.type.startsWith("image/")) {
    alert("Selecione um arquivo de imagem válido.");
    input.value = "";
    return;
  }

  if (arquivo.size > 10 * 1024 * 1024) {
    alert("A imagem deve ter no máximo 10 MB.");
    input.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const imagem = new Image();

    imagem.onload = function () {
      const tamanhoMaximo = 800;
      const proporcao = Math.min(
        1,
        tamanhoMaximo / Math.max(imagem.naturalWidth, imagem.naturalHeight),
      );
      const largura = Math.round(imagem.naturalWidth * proporcao);
      const altura = Math.round(imagem.naturalHeight * proporcao);
      const canvas = document.createElement("canvas");

      canvas.width = largura;
      canvas.height = altura;

      const contexto = canvas.getContext("2d");
      contexto.drawImage(imagem, 0, 0, largura, altura);

      const imagemReduzida =
        arquivo.type === "image/png"
          ? canvas.toDataURL("image/png")
          : canvas.toDataURL("image/jpeg", 0.82);
      const elementoImg = document.getElementById(imgId);

      if (elementoImg) {
        elementoImg.src = imagemReduzida;
      }

      try {
        localStorage.setItem(
          `${chaveBase}_${emailLogado}`,
          imagemReduzida,
        );
      } catch (erro) {
        alert("Não foi possível salvar a foto. O armazenamento está cheio.");
        input.value = "";
      }
    };

    imagem.onerror = function () {
      alert("Não foi possível ler esta imagem.");
      input.value = "";
    };

    imagem.src = event.target.result;
  };

  reader.onerror = function () {
    alert("Não foi possível carregar o arquivo selecionado.");
    input.value = "";
  };

  reader.readAsDataURL(arquivo);
}
