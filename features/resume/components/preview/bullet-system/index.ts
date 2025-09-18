/**
 * Bullet System - 簡潔高效的列點編輯系統
 * 
 * 使用方式：
 * 
 * ```tsx
 * import { BulletText } from './bullet-system';
 * 
 * {outcomes.map((text, index) => (
 *   <li key={index}>
 *     <BulletText
 *       text={text}
 *       groupId={`section-${sectionIndex}-outcomes`}
 *       index={index}
 *       onChange={(newText) => updateOutcome(index, newText)}
 *       onAddBullet={() => addOutcome(index)}
 *       onRemoveBullet={() => removeOutcome(index)}
 *     />
 *   </li>
 * ))}
 * ```
 */

export { default as BulletText } from './bullet-text';
export { BulletManager } from './bullet-manager';
export { useBulletPoint } from './use-bullet-point';
export type { BulletPoint, BulletGroup } from './bullet-manager';