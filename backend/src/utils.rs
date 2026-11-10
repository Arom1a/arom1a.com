use std::fmt::Display;

pub fn label_gems_text<T: Display>(gems: &[T]) -> String {
    let width = gems.len().to_string().len();
    gems.iter()
        .enumerate()
        .map(|(i, g)| {
            let prefix = format!("{:>width$} ", i + 1, width = width);
            let indent = " ".repeat(prefix.len());
            let body = g.to_string().replace('\n', &format!("\n{indent}"));
            format!("{prefix}{body}")
        })
        .collect::<Vec<_>>()
        .join("\n\n")
}
