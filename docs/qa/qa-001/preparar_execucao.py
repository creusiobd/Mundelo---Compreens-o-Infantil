"""Prepara fichas sintéticas de QA-001. Não executa o produto nem atribui PASS."""
import argparse
import hashlib
import json
from pathlib import Path

def read(path):
    return json.loads(path.read_text(encoding="utf-8"))

def validate(plan, data):
    expected = [f"R{i:02}" for i in range(1, 17)]
    assert [c["id"] for c in plan["cases"]] == expected, "Casos ausentes/duplicados/fora de ordem"
    assert data["synthetic"] is True and data["importable_into_product"] is False
    assert plan["real_data_authorized"] is False and plan["cases_executed"] == 0
    variants = {v["id"]: v["case"] for v in data["variants"]}
    assert len(variants) == 16
    for case in plan["cases"]:
        assert variants[case["dataset_variant"]] == case["id"]
        assert case["result"] == "NAO_EXECUTADO"
        assert case["observed"] is None and not case["evidence_refs"]
        for field in ["preconditions", "steps", "expected", "independent_observation",
                      "evidence_required", "governance_decision", "categories",
                      "gaps", "open_decisions", "acceptance_links", "requirements", "operations"]:
            assert case[field], (case["id"], field)
    return expected

def prepare(source, destination):
    plan = read(source / "roteiro.json")
    data = read(source / "dados-sinteticos.json")
    cases = validate(plan, data)
    # Nova pasta obrigatória; qualquer diretório existente é preservado.
    destination.mkdir(parents=True, exist_ok=False)
    def write(name, obj):
        (destination / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    hashes = {name: hashlib.sha256((source / name).read_bytes()).hexdigest()
              for name in ["roteiro.json", "dados-sinteticos.json"]}
    write("manifesto.json", {"task": "QA-001", "source_base_commit": plan["base_commit"],
          "source_sha256": hashes, "synthetic_only": True, "cases": cases,
          "product_execution_performed": False, "cases_executed": 0,
          "warning": "Estrutura conferida; ausência semântica de dados reais e isolamento exigem conferência humana."})
    write("dados-sinteticos.json", data)
    for case in plan["cases"]:
        write(case["id"] + ".json", {"case": case["id"], "procedure": case,
              "execution": {"result": "NAO_EXECUTADO", "observed": None,
              "readiness": "BLOQUEADO_PARA_ACEITACAO_INTEGRAL", "blockers": [case["blocker"]],
              "examined_commit": None, "environment_ref": None, "policy_revision_refs": [],
              "fixture_adapter_ref": None, "real_operation_path": None, "observation_path": None,
              "controlled_fault_or_clock_ref": None, "executor": None,
              "technical_verifier": None, "independent_reviewer": None,
              "review_checkpoint_refs": [], "started_at": None, "ended_at": None,
              "criteria_observations": [], "evidence_refs": [], "scope_verified": [],
              "limits": [], "next_action": None, "cleanup_result": None}})
    return len(cases)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--saida", type=Path, required=True, help="Pasta NOVA para fichas; nunca sobrescreve")
    args = parser.parse_args()
    try:
        count = prepare(Path(__file__).resolve().parent, args.saida)
    except (AssertionError, KeyError, ValueError, OSError) as error:
        parser.exit(2, f"Preparação interrompida: {error}\n")
    print(f"{count} fichas preparadas; 0 cenários executados; nenhum PASS atribuído.")
