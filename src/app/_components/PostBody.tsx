"use client";

import {
  rainbowColor,
  scOnHalf,
  scOnPalm,
  textBackgroundTransition,
} from "@/styles/values";
import { useEffect, useState } from "react";
import styled from "styled-components";

const PostToCNav = styled.nav`
  @media ${scOnHalf} {
    min-width: 12rem;
    font-size: 0.8rem;
  }
  @media ${scOnPalm} {
    display: none;
  }

  max-width: 20rem;
  flex: 0 1 20rem;
  min-width: 16rem;

  margin-left: 1rem;
  padding-top: 1rem;
  padding-left: 1rem;

  .toc-core {
    position: sticky;
    top: 1rem;

    max-height: 3rem;

    border-left: 4px solid #222222;

    padding-left: 0.75rem;
    padding-right: 1rem;

    li {
      transition: font-size 0.2s, margin 0.2s;

      display: flex;

      margin-bottom: 0.5rem;

      color: #797981;
      word-break: keep-all;

      &.current-heading {
        @media ${scOnHalf} {
          font-size: 0.95rem;
        }
        color: #222222;
        font-weight: bold;
        font-size: 1.1rem;
        margin-top: 0.75rem;
        margin-bottom: 0.75rem;
      }

      &:hover {
        color: #222222;
      }

      > p.toc-indent {
        margin: 0 0 0 1rem;
      }
    }
  }
`;

type ToCItem = {
  text: string;
  id: string;
  level: number;
};

function PostToC({ headings }: { headings: ToCItem[] }) {
  const [current, setCurrent] = useState(-1);

  /* 현재 heading 강조 기능 */
  useEffect(() => {
    if (headings.length === 0) return;

    const headingEls = document.querySelectorAll(
      headings.map((h) => `#${CSS.escape(h.id)}`).join(", ")
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrent(headings.findIndex((h) => h.id === entry.target.id));
        }
      },
      {
        root: null,
        rootMargin: "0% 0% -66% 0%",
        threshold: 1,
      }
    );

    headingEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings.length]);

  return (
    <PostToCNav className="toc-rail">
      <ul className="toc-core">
        {headings.length > 0
          ? headings.map((heading, idx) => {
              return (
                <li
                  key={`post-toc-item-${idx}`}
                  className={`${idx === current ? "current-heading" : ""}`}
                >
                  {Array.from(Array(heading.level), (e, jdx) => {
                    return (
                      <p
                        className="toc-indent"
                        key={`toc-indent-${idx}-${jdx}`}
                      ></p>
                    );
                  })}
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              );
            })
          : undefined}
      </ul>
    </PostToCNav>
  );
}

const PostBodySection = styled.section`
  display: flex;

  max-width: 100%;
  width: 100%;

  /* ***** 게시글 영역 스타일링 ***** */
  .post-content {
    @media ${scOnHalf} {
    }
    @media ${scOnPalm} {
      max-width: 100%;
    }

    flex: 0 1 auto;
    max-width: 75%;
    width: 75%;
    min-width: 0;

    color: #222222;
    font-weight: normal;

    word-break: break-all;
    line-height: calc(1ex / 0.32);

    /** Headings */
    h2 {
      @media ${scOnHalf} {
        font-size: 2rem;
      }
      @media ${scOnPalm} {
      }

      font-size: 2.4rem;
      word-break: keep-all;
      margin-bottom: 0.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #797981;
    }

    h3 {
      font-size: 1.88rem;
      margin-top: 1rem;
      margin-bottom: 0.75rem;
    }

    h4 {
      font-size: 1.5rem;
      margin-top: 0rem;
      margin-bottom: 0.5rem;
    }

    h5,
    h6 {
      margin: 0;
    }

    /** 이미지 */
    img {
      width: 100%;
      object-fit: contain;
    }

    /** 링크 */
    a {
      background: ${rainbowColor};
      background-size: 400% 100%;
      -webkit-background-clip: text;
      background-clip: text;

      -webkit-transition: color 0.2s;
      transition: color 0.2s;

      color: #6666ff;

      &:hover {
        animation: ${textBackgroundTransition} 6s ease-in-out infinite;
        color: transparent;
      }
      &:active {
        animation: none;
        color: lighten(#222222, 50%);
      }

      &.a-not-colored {
        color: #222222;
        &:hover {
          animation: none;
          color: #222222;
        }
      }
    }

    /** 리스트 */
    ul {
      list-style-type: disc;
      padding-left: 1.5rem;
    }

    /** 구분선 */
    hr {
    }

    /** 인라인 코드 하이라이팅 */
    p > code {
      background-color: #22272e;
      color: #adbac7;
      padding: 0 0.25rem;
      margin: 0 0.1rem;
      border-radius: 0.33rem;
    }

    /** 코드 블록 하이라이팅 */
    figure {
      margin-left: 0;
      margin-right: 0;

      box-shadow: 0px 8px 6px -6px #1b1b1b;
      position: relative;

      border-radius: 1rem;

      overflow: hidden;

      pre {
        margin: 0;
        overflow-x: scroll;

        border-radius: 1rem;
        scrollbar-width: auto;

        ::-webkit-scrollbar {
          display: unset;
          height: 0.5rem;
        }

        ::-webkit-scrollbar-thumb {
          background-color: #22272e;
          border-radius: 1rem;
        }

        ::-webkit-scrollbar-track {
          background-color: #22272e;
          border-radius: 0 0 1rem 1rem;
        }

        > code {
          padding: 1rem;
        }
      }
    }
  }
`;

export function PostBody({ content }: { content: string }) {
  const [headings, setHeadings] = useState<ToCItem[]>([]);

  /** content로부터 headings 추출 (for ToC) */
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingEls = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const buffer: ToCItem[] = [];
    headingEls.forEach((el) => {
      buffer.push({
        text: el.textContent ?? "",
        id: el.id,
        level: +el.tagName.split("H")[1] - 2,
      });
    });
    setHeadings(buffer);
  }, []);

  return (
    <PostBodySection>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <PostToC headings={headings} />
    </PostBodySection>
  );
}

export default PostBody;
