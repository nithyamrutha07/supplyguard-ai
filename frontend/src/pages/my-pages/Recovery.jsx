
import { useState } from 'react';

import {
  CheckCircle2,
  ShieldCheck,
  Clock3,
  IndianRupee,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

import SectionTitle from '../components/SectionTitle';
import { recoveryOptions } from '../data/demoData';

export default function Recovery({ industry }) {
  const [approved, setApproved] = useState([]);
  const [choice, setChoice] = useState('OPT-01');
  const [message, setMessage] = useState('');

  const selected = recoveryOptions.find(
    (x) => x.id === choice
  );

  function approve() {
    if (!selected.compliant) {
      setMessage(
        'This option is blocked pending compliance review. Select a compliant recovery option.'
      );
      return;
    }

    setApproved((a) => [...a, choice]);

    setMessage(
      `${selected.name} has been marked as approved in this frontend demo. No real shipment or inventory has been changed.`
    );
  }

  return (
    <>
      <SectionTitle
        eyebrow="DECISION & RECOVERY ENGINE"
        title="Recovery planning"
        description="Compare recovery strategies, validate compliance and request human approval."
        action={
          <span className="pill pill-blue">
            INC-2048 · ACTIVE CASE
          </span>
        }
      />

      <div className="recovery-context">
        <div className="context-icon">
          <AlertTriangle size={20} />
        </div>

        <div>
          <b>Raw material shipment delayed — Apex Metals</b>
          <p>
            Potential production interruption at Bengaluru facility ·
            3 customer orders affected
          </p>
        </div>

        <div className="context-impact">
          <small>Estimated exposure</small>
          <b>₹8.4L</b>
        </div>
      </div>

      <div className="recovery-layout">
        <section>
          <div className="panel page-panel">
            <div className="panel-head">
              <div>
                <h3>Recommended recovery options</h3>
                <p>
                  Ranked by cost, delivery time and business impact
                </p>
              </div>

              <span className="pill pill-green">
                3 OPTIONS FOUND
              </span>
            </div>

            <div className="option-list">
              {recoveryOptions.map((o, i) => (
                <button
                  key={o.id}
                  className={`option-card ${
                    choice === o.id ? 'chosen' : ''
                  }`}
                  onClick={() => {
                    setChoice(o.id);
                    setMessage('');
                  }}
                >
                  <div className="option-top">
                    <div>
                      <span className="option-rank">
                        OPTION 0{i + 1}
                      </span>

                      <h4>{o.name}</h4>
                    </div>

                    <div className="score">
                      {o.score}
                      <small>FIT SCORE</small>
                    </div>
                  </div>

                  <div className="option-stats">
                    <div>
                      <Clock3 size={14} />
                      <span>{o.delivery}</span>
                    </div>

                    <div>
                      <IndianRupee size={14} />
                      <span>
                        ₹{(o.cost / 1000).toFixed(0)}K recovery cost
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 size={14} />
                      <span>
                        ₹{(o.avoided / 1000).toFixed(0)}K avoided loss
                      </span>
                    </div>
                  </div>

                  <div className="option-bottom">
                    <span
                      className={
                        o.compliant
                          ? 'text-green'
                          : 'text-danger'
                      }
                    >
                      {o.compliant
                        ? '✓ Compliance checks passed'
                        : '! Compliance review required'}
                    </span>

                    <span>
                      {choice === o.id
                        ? 'Selected'
                        : 'Select option'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="panel approval-panel">
          <div className="panel-head">
            <div>
              <h3>Decision review</h3>
              <p>Human-in-the-loop approval</p>
            </div>

            <ShieldCheck
              size={20}
              className="text-green"
            />
          </div>

          {selected && (
            <>
              <div className="review-choice">
                <small>SELECTED STRATEGY</small>
                <b>{selected.name}</b>
                <p>{selected.reason}</p>
              </div>

              <div className="review-line">
                <span>Recovery cost</span>
                <b>
                  ₹{selected.cost.toLocaleString('en-IN')}
                </b>
              </div>

              <div className="review-line">
                <span>Estimated avoided loss</span>
                <b className="text-green">
                  ₹{selected.avoided.toLocaleString('en-IN')}
                </b>
              </div>

              <div className="review-line">
                <span>Net estimated benefit</span>
                <b>
                  ₹{(
                    selected.avoided - selected.cost
                  ).toLocaleString('en-IN')}
                </b>
              </div>

              <div className="review-line">
                <span>Industry profile</span>
                <b>{industry}</b>
              </div>

              <div
                className={`compliance-box ${
                  selected.compliant ? 'pass' : 'blocked'
                }`}
              >
                <ShieldCheck size={17} />

                <span>
                  {selected.compliant
                    ? 'Compliance validation passed'
                    : 'Compliance validation required'}
                </span>
              </div>

              <button
                className="btn btn-primary full-btn"
                onClick={approve}
                disabled={
                  !selected.compliant ||
                  approved.includes(choice)
                }
              >
                {approved.includes(choice)
                  ? 'Approved in demo'
                  : 'Approve recovery plan'}

                <ArrowRight size={15} />
              </button>

              {!selected.compliant && (
                <p className="small-warning">
                  This option cannot be approved until compliance
                  requirements are satisfied.
                </p>
              )}
            </>
          )}

          {message && (
            <div className="inline-message">
              {message}
            </div>
          )}
        </aside>
      </div>

      <div className="human-note">
        <ShieldCheck size={16} />

        <span>
          <b>Human approval is mandatory.</b> SupplyGuard AI recommends
          actions but does not autonomously commit real-world
          procurement, shipment or inventory changes.
        </span>
      </div>
    </>
  );
}
