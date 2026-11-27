# ONB-004.5B-04B — consolidação

## Técnica
Expor prazo local de sessão sem expor token. Interface oculta acolhimento e aceites na expiração, inclusive ao retornar foco; erros limpam estado visual e exigem encerramento pelo controlador. Playwright real acrescenta confirmação profissional, recuperação, senha redefinida, aceite, jornada PRO_INFO, axe, relógio virtual e cancelamento de fluxo por reload.

## Arquitetura
Mantém SDK e tokens em memória, callback manual na mesma instância. Reload cancela o fluxo e não restaura autorização; retomada transparente do verifier não implementada. A escolha reduz superfície de armazenamento; não prova revogação no servidor por relógio virtual, nem expiração durante operação concorrente. Não há polling de autorização que renove inatividade do servidor. RLS/RPC permanecem soberanos. Erro de logout mantém estado incerto.

## Negócio
Famílias e profissionais têm jornadas distintas; recuperação não concede acesso; autorização não é presumida após expiração. Nenhuma credencial profissional validada ou vínculo infantil criado. Reduz risco de exposição antes do piloto. Gate de continuidade transparente permanece aberto e requer decisão específica antes da homologação final. Sem deploy, dados reais ou alterações hospedadas. #27/#29/#35/G5 bloqueados. #87 aberta. CI pendente.
