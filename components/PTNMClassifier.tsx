'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface ClassificationResult {
  ptnm: string;
  breakdown: {
    p: string;
    t: string;
    n: string;
    m: string;
  };
  explanation: string;
  clinicalImplications: string;
  recommendations: string;
}

type StyleOption = 'clinical' | 'modern' | 'compact';

interface PatientData {
  age: string;
  symptomDuration: string;
  diseaseStability: string;
  changeOverTime: string;
  pain: string;
  painDuration: string;
  curvatureDegree: string;
  curvatureDirection: string;
  calcification: string;
  indentationHourglass: string;
  trauma: string;
  lifelong: string;
  shorteningED: string;
}

const PTNMClassifier: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    age: '',
    symptomDuration: '',
    diseaseStability: '',
    changeOverTime: '',
    pain: '',
    painDuration: '',
    curvatureDegree: '',
    curvatureDirection: '',
    calcification: '',
    indentationHourglass: '',
    trauma: '',
    lifelong: '',
    shorteningED: ''
  });
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [styleOption, setStyleOption] = useState<StyleOption>('modern');

  const updateField = (field: keyof PatientData, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const buildCaseDescription = (): string => {
    const parts: string[] = [];
    
    if (patientData.age) parts.push(`${patientData.age}-year-old male`);
    if (patientData.symptomDuration) parts.push(`with ${patientData.symptomDuration} history of penile curvature`);
    if (patientData.changeOverTime) parts.push(`Condition has ${patientData.changeOverTime} since onset`);
    if (patientData.diseaseStability) parts.push(`Stable for ${patientData.diseaseStability}`);
    if (patientData.pain === 'yes' && patientData.painDuration) parts.push(`Reports pain for ${patientData.painDuration}`);
    if (patientData.pain === 'no') parts.push(`Denies pain`);
    if (patientData.curvatureDegree) parts.push(`${patientData.curvatureDegree}-degree curvature`);
    if (patientData.curvatureDirection) parts.push(`${patientData.curvatureDirection} direction`);
    if (patientData.calcification) parts.push(`Calcification: ${patientData.calcification}`);
    if (patientData.indentationHourglass) parts.push(`Indentation/hourglass deformity: ${patientData.indentationHourglass}`);
    if (patientData.trauma === 'yes') parts.push(`History of penile trauma recalled`);
    if (patientData.trauma === 'no') parts.push(`No history of trauma`);
    if (patientData.lifelong === 'yes') parts.push(`Curvature present since birth or puberty`);
    if (patientData.shorteningED) parts.push(`${patientData.shorteningED}`);
    
    return parts.join('. ') + '.';
  };

  const isFormComplete = (): boolean => {
    const requiredFields: (keyof PatientData)[] = [
      'age', 'symptomDuration', 'changeOverTime', 'pain', 
      'curvatureDegree', 'curvatureDirection', 'trauma', 'lifelong'
    ];
    return requiredFields.every(field => patientData[field] !== '');
  };

  const classifyCase = async () => {
    if (!isFormComplete()) {
      setError('Please complete all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setClassification(null);

    const caseDescription = buildCaseDescription();

    const systemPrompt = `You are a specialized urologist expert in Peyronie's disease classification using the PTNM system.

PTNM Classification System:
- P (PD Component): 0=none, Cl=classical, Ca=calcifying, P=progressive, R=relapsing/remitting, U=undifferentiated
- T (Trauma): 0=absent, 1=present
- N (Non-PD): 0=none, C=congenital, M=maturational, U=undifferentiated
- M (Mode): 0=stable, 1=active, x=not applicable

Key Criteria:
- Progressive: Subjective worsening ≥3 months after onset
- Calcifying: Moderate/severe calcification on imaging
- Classical: Exclusion diagnosis (no other PD subtypes)
- Relapsing/Remitting: Reactivation after ≥6 months stability
- Congenital: Curvature since birth
- Maturational: Curvature developing around puberty
- Trauma-induced: Curvature following recalled trauma

Stable Phase Definitions:
- Classical PD: ≥3 months since onset
- Nonclassical PD: EITHER ≥12 months since onset AND stable ≥3 months OR stable ≥6 months

Analyze the patient case and provide:
1. Complete PTNM classification (e.g., PClT1N0M0)
2. Breakdown of each component with reasoning
3. Clinical implications
4. Treatment recommendations

Respond in valid JSON format:
{
  "ptnm": "PClT1N0M0",
  "breakdown": {
    "p": "Classical PD - meets exclusion criteria, no progressive/calcifying/relapsing features",
    "t": "Trauma present - patient recalled specific injury",
    "n": "No congenital/maturational component",
    "m": "Stable phase - symptoms stable for 4 months"
  },
  "explanation": "Detailed explanation of classification",
  "clinicalImplications": "What this means for the patient",
  "recommendations": "Suggested treatment approach"
}`;

    try {
      const apiKey = process.env.NEXT_PUBLIC_BLACKBOX_API_KEY || 'sk-yMV2eiGm9WfY74VkAvO3og';
      
      console.log('Sending request to Blackbox AI...');
      console.log('Case description:', caseDescription);
      
      const response = await fetch('https://api.blackbox.ai/api/chat', {
        method: 'POST',
        headers:  {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Classify this patient case using the PTNM system:\n\n${caseDescription}` }
          ],
          previewToken: null,
          userId: apiKey,
          codeModelMode: true,
          agentMode: {},
          trendingAgentMode: {},
          isMicMode: false,
          userSystemPrompt: null,
          maxTokens: 2000,
          playgroundTopP: 0.9,
          playgroundTemperature: 0.3,
          isChromeExt: false,
          githubToken: null,
          clickedAnswer2: false,
          clickedAnswer3: false,
          clickedForceWebSearch: false,
          visitFromDelta: false,
          mobileClient: false
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid API response structure');
      }
      
      const content = data.choices[0].message.content;
      console.log('AI Response content:', content);
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', content);
        throw new Error('Invalid response format - no JSON found');
      }
      
      const result: ClassificationResult = JSON.parse(jsonMatch[0]);
      console.log('Parsed classification:', result);
      setClassification(result);
    } catch (err) {
      console.error('Classification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to classify case: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!classification) return;
    
    const data = {
      patientData,
      caseDescription: buildCaseDescription(),
      classification,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ptnm-classification-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (!classification) return;
    
    const caseDescription = buildCaseDescription();
    
    const content = `
PTNM CLASSIFICATION REPORT
Generated: ${new Date().toLocaleString()}

PATIENT CASE:
${caseDescription}

CLASSIFICATION: ${classification.ptnm}

COMPONENT BREAKDOWN:
P (PD Component): ${classification.breakdown.p}
T (Trauma): ${classification.breakdown.t}
N (Non-PD): ${classification.breakdown.n}
M (Mode): ${classification.breakdown.m}

EXPLANATION:
${classification.explanation}

CLINICAL IMPLICATIONS:
${classification.clinicalImplications}

RECOMMENDATIONS:
${classification.recommendations}

Reference: Trost et al. (2024) - Creation of a Novel Classification System (PTNM) for Peyronie's Disease
    `.trim();
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ptnm-classification-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderClassification = () => {
    if (!classification) return null;

    if (styleOption === 'clinical') {
      return (
        <div className="space-y-6">
          <Card className="border-primary">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-2xl font-bold">Classification Result</CardTitle>
              <CardDescription className="text-primary-foreground opacity-90">
                PTNM Code: {classification.ptnm}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">P Component</div>
                  <div className="text-sm">{classification.breakdown.p}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">T Component</div>
                  <div className="text-sm">{classification.breakdown.t}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">N Component</div>
                  <div className="text-sm">{classification.breakdown.n}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">M Component</div>
                  <div className="text-sm">{classification.breakdown.m}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Explanation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{classification.explanation}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Clinical Implications</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{classification.clinicalImplications}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Recommendations</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{classification.recommendations}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (styleOption === 'modern') {
      return (
        <div className="space-y-6">
          <Card className="border-2 border-accent">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold mb-2">{classification.ptnm}</h2>
                <p className="text-muted-foreground">PTNM Classification</p>
              </div>
              
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary mb-1">{classification.ptnm.match(/P[^\s]*/)?.[0] || 'P0'}</div>
                  <div className="text-xs text-muted-foreground">PD Component</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20">
                  <div className="text-2xl font-bold text-secondary-foreground mb-1">{classification.ptnm.match(/T\d/)?.[0] || 'T0'}</div>
                  <div className="text-xs text-muted-foreground">Trauma</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                  <div className="text-2xl font-bold text-accent-foreground mb-1">{classification.ptnm.match(/N[^\s]*/)?.[0] || 'N0'}</div>
                  <div className="text-xs text-muted-foreground">Non-PD</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-muted to-muted/50 rounded-lg border border-border">
                  <div className="text-2xl font-bold mb-1">{classification.ptnm.match(/M[^\s]*/)?.[0] || 'M0'}</div>
                  <div className="text-xs text-muted-foreground">Mode</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Explanation
                  </h3>
                  <p className="text-sm text-muted-foreground">{classification.explanation}</p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Clinical Implications</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{classification.clinicalImplications}</p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold mb-2 text-green-900 dark:text-green-100">Recommendations</h3>
                  <p className="text-sm text-green-800 dark:text-green-200">{classification.recommendations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Classification: {classification.ptnm}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-24">P:</span>
              <span className="text-sm text-muted-foreground">{classification.breakdown.p}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-24">T:</span>
              <span className="text-sm text-muted-foreground">{classification.breakdown.t}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-24">N:</span>
              <span className="text-sm text-muted-foreground">{classification.breakdown.n}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-24">M:</span>
              <span className="text-sm text-muted-foreground">{classification.breakdown.m}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t space-y-3">
            <div>
              <p className="text-sm font-semibold mb-1">Explanation:</p>
              <p className="text-sm text-muted-foreground">{classification.explanation}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Clinical Implications:</p>
              <p className="text-sm text-muted-foreground">{classification.clinicalImplications}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Recommendations:</p>
              <p className="text-sm text-muted-foreground">{classification.recommendations}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            PTNM Classification System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered Peyronie's Disease classification based on evidence-based criteria
          </p>
          <p className="text-sm text-muted-foreground">
            Reference: Trost et al. (2024) - J Urol. 212(3):470-482
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Patient Assessment Form</CardTitle>
            <CardDescription>
              Complete the following questions to generate a PTNM classification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Patient Age *</Label>
                <Select value={patientData.age} onValueChange={(value) => updateField('age', value)}>
                  <SelectTrigger id="age">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-30">18-30 years</SelectItem>
                    <SelectItem value="31-40">31-40 years</SelectItem>
                    <SelectItem value="41-50">41-50 years</SelectItem>
                    <SelectItem value="51-60">51-60 years</SelectItem>
                    <SelectItem value="61-70">61-70 years</SelectItem>
                    <SelectItem value="71+">71+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptomDuration">Duration of Symptoms *</Label>
                <Select value={patientData.symptomDuration} onValueChange={(value) => updateField('symptomDuration', value)}>
                  <SelectTrigger id="symptomDuration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<1 month">&lt;1 month</SelectItem>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="1-2 years">1-2 years</SelectItem>
                    <SelectItem value=">2 years">&gt;2 years</SelectItem>
                    <SelectItem value="Since birth/puberty">Since birth/puberty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diseaseStability">How long has condition been stable?</Label>
                <Select value={patientData.diseaseStability} onValueChange={(value) => updateField('diseaseStability', value)}>
                  <SelectTrigger id="diseaseStability">
                    <SelectValue placeholder="Select stability duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Still changing">Still actively changing</SelectItem>
                    <SelectItem value="<1 month">&lt;1 month</SelectItem>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value=">12 months">&gt;12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="changeOverTime">Change Since Onset *</Label>
                <Select value={patientData.changeOverTime} onValueChange={(value) => updateField('changeOverTime', value)}>
                  <SelectTrigger id="changeOverTime">
                    <SelectValue placeholder="Select change pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="improved">Improved</SelectItem>
                    <SelectItem value="remained stable">Remained stable</SelectItem>
                    <SelectItem value="worsened">Worsened</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pain">Current or Past Pain? *</Label>
                <Select value={patientData.pain} onValueChange={(value) => updateField('pain', value)}>
                  <SelectTrigger id="pain">
                    <SelectValue placeholder="Select pain status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {patientData.pain === 'yes' && (
                <div className="space-y-2">
                  <Label htmlFor="painDuration">Pain Duration</Label>
                  <Select value={patientData.painDuration} onValueChange={(value) => updateField('painDuration', value)}>
                    <SelectTrigger id="painDuration">
                      <SelectValue placeholder="Select pain duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1 month">&lt;1 month</SelectItem>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value=">12 months">&gt;12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="curvatureDegree">Curvature Degree *</Label>
                <Select value={patientData.curvatureDegree} onValueChange={(value) => updateField('curvatureDegree', value)}>
                  <SelectTrigger id="curvatureDegree">
                    <SelectValue placeholder="Select curvature degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<15">Mild (&lt;15°)</SelectItem>
                    <SelectItem value="15-30">Mild-Moderate (15-30°)</SelectItem>
                    <SelectItem value="30-45">Moderate (30-45°)</SelectItem>
                    <SelectItem value="45-60">Moderate-Severe (45-60°)</SelectItem>
                    <SelectItem value="60-90">Severe (60-90°)</SelectItem>
                    <SelectItem value=">90">Very Severe (&gt;90°)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="curvatureDirection">Curvature Direction *</Label>
                <Select value={patientData.curvatureDirection} onValueChange={(value) => updateField('curvatureDirection', value)}>
                  <SelectTrigger id="curvatureDirection">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dorsal">Dorsal (upward)</SelectItem>
                    <SelectItem value="Dorsolateral">Dorsolateral (up and to side)</SelectItem>
                    <SelectItem value="Lateral">Lateral (to the side)</SelectItem>
                    <SelectItem value="Ventrolateral">Ventrolateral (down and to side)</SelectItem>
                    <SelectItem value="Ventral">Ventral (downward)</SelectItem>
                    <SelectItem value="Multiple">Multiple directions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calcification">Plaque Calcification</Label>
                <Select value={patientData.calcification} onValueChange={(value) => updateField('calcification', value)}>
                  <SelectTrigger id="calcification">
                    <SelectValue placeholder="Select calcification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Mild (stippling)">Mild (stippling)</SelectItem>
                    <SelectItem value="Moderate (shadowing)">Moderate (shadowing)</SelectItem>
                    <SelectItem value="Severe (>1cm)">Severe (&gt;1cm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indentationHourglass">Indentation/Hourglass Deformity</Label>
                <Select value={patientData.indentationHourglass} onValueChange={(value) => updateField('indentationHourglass', value)}>
                  <SelectTrigger id="indentationHourglass">
                    <SelectValue placeholder="Select deformity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Mild (<10% narrowing)">Mild (&lt;10% narrowing)</SelectItem>
                    <SelectItem value="Moderate (10-25% narrowing)">Moderate (10-25% narrowing)</SelectItem>
                    <SelectItem value="Severe (>25% narrowing)">Severe (&gt;25% narrowing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trauma">History of Penile Trauma? *</Label>
                <Select value={patientData.trauma} onValueChange={(value) => updateField('trauma', value)}>
                  <SelectTrigger id="trauma">
                    <SelectValue placeholder="Select trauma history" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes - recalls specific injury</SelectItem>
                    <SelectItem value="no">No recalled trauma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lifelong">Curvature Since Birth/Puberty? *</Label>
                <Select value={patientData.lifelong} onValueChange={(value) => updateField('lifelong', value)}>
                  <SelectTrigger id="lifelong">
                    <SelectValue placeholder="Select timing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes - lifelong or since puberty</SelectItem>
                    <SelectItem value="no">No - developed later in life</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shorteningED">Additional Symptoms</Label>
                <Select value={patientData.shorteningED} onValueChange={(value) => updateField('shorteningED', value)}>
                  <SelectTrigger id="shorteningED">
                    <SelectValue placeholder="Select symptoms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Penile shortening only">Penile shortening only</SelectItem>
                    <SelectItem value="Erectile dysfunction only">Erectile dysfunction only</SelectItem>
                    <SelectItem value="Both shortening and ED">Both shortening and ED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="styleOption">Display Style</Label>
                <Select value={styleOption} onValueChange={(value) => setStyleOption(value as StyleOption)}>
                  <SelectTrigger id="styleOption">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern - Visual cards with color coding</SelectItem>
                    <SelectItem value="clinical">Clinical - Detailed professional layout</SelectItem>
                    <SelectItem value="compact">Compact - Simple condensed view</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={classifyCase} 
              disabled={loading || !isFormComplete()}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Patient Data...
                </>
              ) : (
                'Generate PTNM Classification'
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {!isFormComplete() && (
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg border border-border">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Please complete all required fields (*) to generate classification</span>
              </div>
            )}
          </CardContent>
        </Card>

        {classification && (
          <>
            {renderClassification()}

            <Card>
              <CardHeader>
                <CardTitle>Export Results</CardTitle>
                <CardDescription>Download classification results in your preferred format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={downloadJSON} variant="outline" className="flex-1 min-w-48">
                    <Download className="w-4 h-4 mr-2" />
                    Download JSON
                  </Button>
                  <Button onClick={downloadPDF} variant="outline" className="flex-1 min-w-48">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About PTNM Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">System Components:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>P (PD Component):</strong> Classical, Calcifying, Progressive, Relapsing/Remitting</li>
                <li><strong>T (Trauma):</strong> Present or Absent</li>
                <li><strong>N (Non-PD):</strong> Congenital, Maturational, or None</li>
                <li><strong>M (Mode):</strong> Active or Stable phase</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Key Definitions:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Progressive PD:</strong> Subjective worsening ≥3 months after onset</li>
                <li><strong>Calcifying PD:</strong> Moderate or severe plaque calcification</li>
                <li><strong>Classical PD:</strong> Does not meet criteria for other subtypes</li>
                <li><strong>Relapsing/Remitting:</strong> Reactivation after ≥6 months stability</li>
              </ul>
            </div>
            <p className="text-xs pt-4 border-t">
              This tool uses AI to assist with PTNM classification based on the research by Trost, Mulhall, and Hellstrom (2024).
              Results should be reviewed by qualified healthcare professionals and are for educational purposes only.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PTNMClassifier;
