# Skill: Bioinformatics & Genomic Data Pipeline Synthesis
`id`: `kbcodedev/bioinformatics-genomic-pipeline`  
`category`: `11-scientific-quantitative-ai`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Parsing high-throughput genomic data files (FASTA, FASTQ, BAM/SAM, VCF), sequence alignment (Smith-Waterman, Needleman-Wunsch), variant calling, and computational biology analysis using Biopython, PySAM, and Scanpy.
- **Triggers**: Genomic data processing, sequence alignment algorithm implementation, DNA/RNA transcript mutation analysis, single-cell RNA-seq pipelines.
- **Prerequisites**: Python Biopython / PySAM libraries, reference genome assemblies (e.g. GRCh38).

---

## 2. Core Mental Model & Invariant Principles
1. **Streaming Iteration for Massive FASTQ Files**: Never load multi-gigabyte FASTQ/BAM files entirely into memory; stream sequence records one by one using generator iterators (`SeqIO.parse()`).
2. **Quality Score Phred Encoding**: Account for Phred quality scores ($Q = -10 \log_{10} P_{\text{error}}$) to filter out low-confidence base calls before executing alignment.
3. **CIGAR String & Genomic Coordinates**: Parse CIGAR strings (`100M2D5M`) accurately to reconstruct insertions, deletions, and nucleotide mismatches relative to the reference genome.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Raw FASTQ Sequencing Reads]
              │
              ▼
┌─────────────────────────────┐
│ Step 1: Quality Filter      │ ── Filter reads with mean Phred score Q >= 30 (99.9% accuracy)
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 2: Sequence Alignment  │ ── Align reads to reference genome (BWA-MEM / Bowtie2)
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 3: Variant Calling     │ ── Identify single nucleotide polymorphisms (SNPs) & indels
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 4: Export to VCF Table │ ── Annotate variant effects (synonymous vs missense)
└─────────────────────────────┘
```

### Verification Gate
- Run this domain's own check against the real artefact before claiming success — the project's test/build/lint command, a schema or spec validator, a render or screenshot/diff inspection, or a dry run — whichever the project actually provides. Report the exact command and its result.
- Written, drafted, generated or merely executed is NOT verified; only the check passing is. If no such check exists or none can be run, say so plainly and deliver the claim as unverified.
- On failure: stop, keep the diagnostic output, name the actual failure, and retry only after something changed.
- Never report a result the check did not produce.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "file_path": "sample_reads.fastq.gz",
  "min_phred_quality": 30,
  "target_gene_coordinates": "chr7:140719327-140719330"
}
```

### Output Contract
```python
from Bio import SeqIO
import gzip

def process_genomic_reads(fastq_gz_path: str, min_quality: int = 30):
    high_quality_reads = 0
    total_reads = 0
    gc_counts = 0
    total_bases = 0

    # Stream large compressed FASTQ file line by line
    with gzip.open(fastq_gz_path, "rt") as handle:
        for record in SeqIO.parse(handle, "fastq"):
            total_reads += 1
            # Calculate mean Phred score
            qualities = record.letter_annotations["phred_quality"]
            mean_q = sum(qualities) / len(qualities)

            if mean_q >= min_quality:
                high_quality_reads += 1
                seq = str(record.seq)
                gc_counts += seq.count("G") + seq.count("C")
                total_bases += len(seq)

    gc_content = (gc_counts / total_bases) * 100 if total_bases > 0 else 0.0

    return {
        "total_reads_processed": total_reads,
        "high_quality_reads_passed": high_quality_reads,
        "pass_rate": f"{(high_quality_reads / total_reads):.2%}",
        "mean_gc_content": f"{gc_content:.2f}%"
    }
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Loading Entire 40GB BAM Files into RAM**: Calling `list(SeqIO.parse())` on raw sequencing files, instantly crashing with Out Of Memory errors.
- ❌ **Ignoring 0-Indexed vs 1-Indexed Coordinates**: Conflating BED format (0-indexed half-open) with VCF/GFF format (1-indexed fully closed), causing 1-base pair off-by-one errors.
- ❌ **Unvalidated Reverse Complements**: Forgetting to reverse-complement reverse-strand reads before comparing against reference sequences.

---

## 6. Real-World Production Example

```markdown
**Genomic Mutation Identification**:
- Analyzed BRAF V600E mutation in cancer cell lines.
- Filtered 14M reads in 4 minutes using streaming Biopython parser; pinpointed $T \rightarrow A$ nucleotide transversion at chromosome 7 coordinate 140,753,336 with 99.98% confidence.
```
