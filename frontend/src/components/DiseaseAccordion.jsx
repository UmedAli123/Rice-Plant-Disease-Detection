import { useState } from 'react';
import { ChevronDown, Bug, Search, Pill, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

const DISEASES = [
    {
        name: 'Bacterial Leaf Blight',
        severity: 'high',
        severityLabel: 'High Severity',
        icon: <ShieldAlert size={20} />,
        cause: 'Caused by the bacterium Xanthomonas oryzae pv. oryzae. It thrives in warm, humid conditions and spreads through contaminated water, wind-driven rain, and infected seeds.',
        symptoms: 'Water-soaked lesions on leaf tips and margins that turn yellow to white. Leaves may wilt and dry up. In severe cases, entire leaves become straw-colored.',
        management: 'Use resistant varieties, ensure proper field sanitation, avoid excess nitrogen fertilization, and apply copper-based bactericides when necessary.'
    },
    {
        name: 'Brown Spot',
        severity: 'medium',
        severityLabel: 'Moderate Severity',
        icon: <AlertTriangle size={20} />,
        cause: 'Caused by the fungus Bipolaris oryzae (Cochliobolus miyabeanus). Often associated with nutrient-deficient soils and poor growing conditions.',
        symptoms: 'Circular or oval brown spots with gray or white centers and dark brown margins on leaves. Spots may coalesce and affect large leaf areas.',
        management: 'Use clean, certified seeds. Apply balanced fertilization (especially potassium and phosphorus). Practice proper water management and consider fungicide treatment.'
    },
    {
        name: 'Healthy Rice Leaf',
        severity: 'none',
        severityLabel: 'Healthy',
        icon: <ShieldCheck size={20} />,
        cause: 'No disease detected — the plant is healthy and showing normal growth patterns.',
        symptoms: 'Green, vibrant leaves with uniform coloration. No visible lesions, spots, or discoloration. Leaves are firm and upright.',
        management: 'Maintain proper irrigation schedules, apply balanced fertilization, monitor regularly for early disease signs, and practice crop rotation.'
    },
    {
        name: 'Leaf Blast',
        severity: 'high',
        severityLabel: 'High Severity',
        icon: <ShieldAlert size={20} />,
        cause: 'Caused by the fungus Magnaporthe oryzae (Pyricularia oryzae). It is one of the most destructive rice diseases worldwide, favored by cool temperatures and high humidity.',
        symptoms: 'Diamond-shaped or spindle-shaped lesions with gray-white centers and dark brown borders. In severe infections, lesions may kill entire leaves.',
        management: 'Plant resistant varieties, avoid excessive nitrogen, ensure proper plant spacing for air circulation, and apply systemic fungicides preventively.'
    },
    {
        name: 'Leaf Scald',
        severity: 'medium',
        severityLabel: 'Moderate Severity',
        icon: <AlertTriangle size={20} />,
        cause: 'Caused by the fungus Microdochium oryzae. Commonly occurs in areas with fluctuating temperatures and high humidity during the growing season.',
        symptoms: 'Large oblong lesions with alternating light and dark bands, giving a scalded or burnt appearance. Lesions typically start at leaf tips.',
        management: 'Use clean, disease-free seeds. Practice crop rotation, avoid dense planting, ensure balanced fertilization, and remove infected plant debris.'
    },
    {
        name: 'Sheath Blight',
        severity: 'high',
        severityLabel: 'High Severity',
        icon: <ShieldAlert size={20} />,
        cause: 'Caused by the soil-borne fungus Rhizoctonia solani. It persists as sclerotia in soil and plant debris, spreading rapidly in dense, humid canopies.',
        symptoms: 'Oval or irregularly shaped lesions on leaf sheaths with white-gray centers and brown margins. Lesions may extend to leaf blades in severe cases.',
        management: 'Avoid excessive nitrogen fertilization, maintain wider plant spacing, manage water levels carefully, and apply recommended fungicides at early infection stages.'
    }
];

export default function DiseaseAccordion() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="accordion">
            {DISEASES.map((disease, idx) => {
                const isOpen = openIndex === idx;
                return (
                    <div
                        key={disease.name}
                        className={`accordion-item ${isOpen ? 'open' : ''} severity-${disease.severity}`}
                    >
                        <button
                            className="accordion-trigger"
                            onClick={() => toggle(idx)}
                            aria-expanded={isOpen}
                        >
                            <div className="accordion-trigger-left">
                                <span className={`accordion-dot ${disease.severity}`} />
                                <span className="accordion-icon">{disease.icon}</span>
                                <span className="accordion-label">{disease.name}</span>
                            </div>
                            <div className="accordion-trigger-right">
                                <ChevronDown
                                    size={18}
                                    className={`accordion-chevron ${isOpen ? 'rotated' : ''}`}
                                />
                            </div>
                        </button>

                        <div className={`accordion-content ${isOpen ? 'expanded' : ''}`}>
                            <div className="accordion-body">
                                <div className="accordion-info-row">
                                    <div className="accordion-info-block">
                                        <div className="accordion-info-label">
                                            <Bug size={15} /> Cause
                                        </div>
                                        <p>{disease.cause}</p>
                                    </div>
                                    <div className="accordion-info-block">
                                        <div className="accordion-info-label">
                                            <Search size={15} /> Symptoms
                                        </div>
                                        <p>{disease.symptoms}</p>
                                    </div>
                                    <div className="accordion-info-block">
                                        <div className="accordion-info-label">
                                            <Pill size={15} /> Management
                                        </div>
                                        <p>{disease.management}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
