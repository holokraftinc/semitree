"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { NumberField } from "@/components/tools/calculator/NumberField";
import {
  MeasurementField,
  type MeasurementValue,
} from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { builtInPotential, type BuiltInPotentialResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

// Doping is entered in the conventional cm^-3; convert to SI m^-3 (× 1e6).
const CM3_TO_M3 = 1e6;

export function BuiltInPotentialCalculator() {
  const [acceptor, setAcceptor] = useState("1e17");
  const [donor, setDonor] = useState("1e15");
  const [temperature, setTemperature] = useState<MeasurementValue>({ raw: "300", unit: "K" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<BuiltInPotentialResult | null>(null);

  const reset = () => {
    setAcceptor("1e17");
    setDonor("1e15");
    setTemperature({ raw: "300", unit: "K" });
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const na = parseNumber(acceptor);
    const nd = parseNumber(donor);
    const t = measurementToSI(temperature);
    const nextErrors: Record<string, string> = {};
    if (na === null) nextErrors.acceptorConc = "Enter a valid number.";
    if (nd === null) nextErrors.donorConc = "Enter a valid number.";
    if (t === null) nextErrors.temperature = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = builtInPotential({
      acceptorConc: na! * CM3_TO_M3,
      donorConc: nd! * CM3_TO_M3,
      temperature: t!,
    });
    if (!res.ok) {
      setErrors(res.field ? { [res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "built-in-potential", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "built-in-potential" });
  };

  return (
    <CalculatorShell
      title="Built-in potential"
      description="Equilibrium junction potential of an abrupt silicon PN junction from its doping."
      tier="mvp"
      trackSlug="built-in-potential"
      categoryLabel="Semiconductor physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Built-in potential" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <NumberField
            label="Acceptor concentration (N_a)"
            value={acceptor}
            onChange={setAcceptor}
            error={errors.acceptorConc}
            suffix="cm⁻³"
            help="p-side doping. Accepts scientific notation, e.g. 1e17."
          />
          <NumberField
            label="Donor concentration (N_d)"
            value={donor}
            onChange={setDonor}
            error={errors.donorConc}
            suffix="cm⁻³"
            help="n-side doping, e.g. 1e15."
          />
          <MeasurementField
            label="Temperature (T)"
            quantity="temperature"
            value={temperature}
            onChange={setTemperature}
            error={errors.temperature}
          />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  {
                    label: "Built-in potential (V_bi)",
                    value: formatNumber(result.builtInPotential),
                    unit: "V",
                    primary: true,
                  },
                  {
                    label: "Thermal voltage (kT/q)",
                    value: formatNumber(result.thermalVoltage * 1000),
                    unit: "mV",
                  },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            V_bi is the equilibrium potential barrier that forms across the
            depletion region of a PN junction. Heavier doping on either side
            raises it (logarithmically); higher temperature lowers it through the
            rising intrinsic carrier concentration. For silicon it is typically
            0.6–0.8 V. It is not directly measurable as a terminal voltage — it
            is cancelled by contact potentials at equilibrium.
          </p>
        ) : (
          <p>
            Enter the two doping levels and the temperature. This uses silicon
            (n_i ≈ 1×10¹⁰ cm⁻³ at 300 K).
          </p>
        )
      }
      formula={{
        expression: "V_bi = (kT/q) · ln(N_a · N_d / n_i²)",
        label: "Built-in potential (abrupt junction)",
        caption: "k = Boltzmann constant, q = elementary charge, n_i = intrinsic concentration.",
      }}
      variables={[
        { symbol: "V_bi", name: "Built-in potential", unit: "V" },
        { symbol: "k", name: "Boltzmann constant", unit: "J/K" },
        { symbol: "T", name: "Temperature", unit: "K" },
        { symbol: "q", name: "Elementary charge", unit: "C" },
        { symbol: "N_a", name: "Acceptor concentration", unit: "m⁻³" },
        { symbol: "N_d", name: "Donor concentration", unit: "m⁻³" },
        { symbol: "n_i", name: "Intrinsic concentration", unit: "m⁻³" },
      ]}
      assumptions={[
        "Abrupt (step) PN junction in thermal equilibrium.",
        "Non-degenerate doping: Boltzmann statistics apply.",
        "Complete ionization of dopants.",
        "Silicon at ~300 K: n_i ≈ 1×10¹⁰ cm⁻³ (sources vary ~0.9–1.5×10¹⁰).",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>N_a = 1×10¹⁷ cm⁻³, N_d = 1×10¹⁵ cm⁻³, T = 300 K.</p>
          <p className="font-mono text-xs text-muted-foreground">
            V_bi = 0.02585 V × ln(10¹⁷·10¹⁵ / (10¹⁰)²) ≈ 0.71 V
          </p>
        </div>
      }
      relatedConcepts={[
        { label: "PN junction", href: "/semiconductors/learn/pn-junction" },
        { label: "Doping", href: "/semiconductors/learn/doping" },
      ]}
      relatedLessons={[
        { label: "Intrinsic semiconductor", href: "/semiconductors/learn/intrinsic-semiconductor" },
        { label: "Diode", href: "/semiconductors/learn/diode" },
      ]}
      relatedTools={[
        ...getRelatedSemiToolLinks("built-in-potential"),
        { label: "Explore semiconductor companies", href: "/industry" },
      ]}
    />
  );
}
